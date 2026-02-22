import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successDataResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/lib/response';
import VitalLog, { type IVitalLog } from '@/models/VitalLog.model';
import Patient, { type IPatient } from '@/models/Patient.model';
import DoseLog from '@/models/DoseLog.model';
import RiskScore from '@/models/RiskScore.model';
import { vitalLogSchema } from '@/schemas/vitals.schema';
import { analyzeStrokeRiskWithGemini } from '@/lib/geminiRisk';
import mongoose from 'mongoose';

async function getAdherencePercent(patientId: string): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const doses = await DoseLog.find({
    patientId: new mongoose.Types.ObjectId(patientId),
    scheduledAt: { $gte: thirtyDaysAgo },
  }).lean<{ status: string }[]>();

  if (doses.length === 0) return 100;

  const taken = doses.filter((d) => d.status === 'taken' || d.status === 'late').length;
  return Math.round((taken / doses.length) * 100);
}

async function getHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') ?? '30', 10);

    const since = new Date();
    since.setDate(since.getDate() - days);

    const logs = await VitalLog.find({
      patientId: new mongoose.Types.ObjectId(patientId),
      loggedAt: { $gte: since },
    })
      .sort({ loggedAt: -1 })
      .lean<IVitalLog[]>();

    return successDataResponse(logs);
  } catch (err) {
    console.error('[GET /api/vitals]', err);
    return errorResponse('Internal server error', 500);
  }
}

async function postHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;

    const body: unknown = await req.json();
    const parsed = vitalLogSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const patient = await Patient.findById(patientId).lean<IPatient>();
    if (!patient) {
      return notFoundResponse('Patient');
    }

    // 1. Persist vitals log
    const vitalLog = await VitalLog.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      ...parsed.data,
    });

    // 2. Fetch medication adherence rate
    const adherence = await getAdherencePercent(patientId);

    // 3. Run Gemini AI stroke risk analysis
    let aiResult;
    try {
      aiResult = await analyzeStrokeRiskWithGemini(patient, parsed.data, adherence);
    } catch (aiErr) {
      console.error('[POST /api/vitals] Gemini AI error:', aiErr);
      // Fallback: derive a basic risk from BP only
      const sys = parsed.data.systolic;
      aiResult = {
        riskLevel: sys >= 160 ? 'HIGH' as const : sys >= 130 ? 'ELEVATED' as const : 'STABLE' as const,
        score: sys >= 160 ? 75 : sys >= 130 ? 45 : 20,
        justification: 'AI analysis unavailable. Risk estimated from blood pressure reading only.',
        strokePreventionSteps: [
          'Monitor blood pressure daily and keep a log.',
          'Take all prescribed medications as directed.',
          'Follow a low-sodium, heart-healthy diet.',
          'Stay physically active with at least 30 minutes of moderate exercise per day.',
          'Reduce stress and maintain healthy sleep habits.',
        ],
      };
    }

    // 4. Save AI analysis back to the vital log
    await VitalLog.findByIdAndUpdate(vitalLog._id, {
      aiReport: {
        riskLevel: aiResult.riskLevel,
        score: aiResult.score,
        justification: aiResult.justification,
        strokePreventionSteps: aiResult.strokePreventionSteps,
      },
    });

    // 5. Persist the risk score record
    const savedRisk = await RiskScore.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      score: aiResult.score,
      level: aiResult.riskLevel,
      drivers: [],           // Gemini doesn't return discrete drivers; justification covers it
      justification: aiResult.justification,
      strokePreventionSteps: aiResult.strokePreventionSteps,
      calculatedAt: new Date(),
    });

    // 6. Return enriched response to frontend
    return successDataResponse(
      {
        vitalLogId: vitalLog._id,
        loggedAt: vitalLog.loggedAt,
        riskUpdate: {
          level: savedRisk.level,
          score: savedRisk.score,
          justification: savedRisk.justification,
          strokePreventionSteps: savedRisk.strokePreventionSteps,
          requiresDoctorVisit: savedRisk.level !== 'STABLE',
          isUrgent: savedRisk.level === 'HIGH',
        },
      },
      201,
    );
  } catch (err) {
    console.error('[POST /api/vitals]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
