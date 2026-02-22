import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successDataResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/lib/response';
import VitalLog, { type IVitalLog } from '@/models/VitalLog.model';
import Patient, { type IPatient } from '@/models/Patient.model';
import DoseLog from '@/models/DoseLog.model';
import RiskScore from '@/models/RiskScore.model';
import { vitalLogSchema } from '@/schemas/vitals.schema';
import { calculateRiskScore } from '@/lib/riskCalculator';
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

    const vitalLog = await VitalLog.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      ...parsed.data,
    });

    // Calculate updated risk score
    const adherence = await getAdherencePercent(patientId);
    const riskResult = calculateRiskScore(patient, parsed.data.systolic, adherence);

    const savedRisk = await RiskScore.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      score:        riskResult.score,
      level:        riskResult.level,
      drivers:      riskResult.drivers,
      calculatedAt: new Date(),
    });

    return successDataResponse(
      {
        ...vitalLog.toObject(),
        riskUpdate: {
          score:   savedRisk.score,
          level:   savedRisk.level,
          drivers: savedRisk.drivers,
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

