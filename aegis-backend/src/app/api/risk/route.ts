import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successDataResponse, errorResponse, notFoundResponse } from '@/lib/response';
import Patient, { type IPatient } from '@/models/Patient.model';
import RiskScore, { type IRiskScore } from '@/models/RiskScore.model';
import DoseLog from '@/models/DoseLog.model';
import VitalLog from '@/models/VitalLog.model';
import { calculateRiskScore } from '@/lib/riskCalculator';
import mongoose from 'mongoose';

async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;
    const patientObjId = new mongoose.Types.ObjectId(patientId);

    const patient = await Patient.findById(patientObjId).lean<IPatient>();
    if (!patient) {
      return notFoundResponse('Patient');
    }

    const recentScores = await RiskScore.find({ patientId: patientObjId })
      .sort({ calculatedAt: -1 })
      .limit(2)
      .lean<IRiskScore[]>();

    if (recentScores.length === 0) {
      const latestVital = await VitalLog.findOne({ patientId: patientObjId })
        .sort({ loggedAt: -1 })
        .lean<{ systolic: number } | null>();

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const doses = await DoseLog.find({
        patientId: patientObjId,
        scheduledAt: { $gte: thirtyDaysAgo },
      }).lean<{ status: string }[]>();

      const takenCount = doses.filter(
        (d: { status: string }) => d.status === 'taken' || d.status === 'late',
      ).length;
      const adherence = doses.length > 0 ? Math.round((takenCount / doses.length) * 100) : 100;

      const systolic = latestVital?.systolic ?? 120;
      const riskResult = calculateRiskScore(patient, systolic, adherence);

      const saved = await RiskScore.create({
        patientId: patientObjId,
        ...riskResult,
        calculatedAt: new Date(),
      });

      return successDataResponse({
        score:       saved.score,
        level:       saved.level,
        drivers:     saved.drivers,
        trend:       'stable',
        lastUpdated: saved.calculatedAt.toISOString(),
      });
    }

    const current = recentScores[0];
    const previous = recentScores[1];

    let trend: 'improving' | 'worsening' | 'stable' = 'stable';
    if (previous) {
      if (current.score > previous.score) trend = 'worsening';
      else if (current.score < previous.score) trend = 'improving';
    }

    return successDataResponse({
      score:       current.score,
      level:       current.level,
      drivers:     current.drivers,
      trend,
      lastUpdated: current.calculatedAt.toISOString(),
    });
  } catch (err) {
    console.error('[GET /api/risk]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(handler);
