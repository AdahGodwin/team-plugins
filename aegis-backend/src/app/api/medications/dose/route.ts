import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import {
  successDataResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from '@/lib/response';
import Medication from '@/models/Medication.model';
import DoseLog from '@/models/DoseLog.model';
import { doseLogSchema } from '@/schemas/medication.schema';
import mongoose from 'mongoose';

async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;

    const body: unknown = await req.json();
    const parsed = doseLogSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const { medicationId, scheduledAt, takenAt, status } = parsed.data;

    const medication = await Medication.findOne({
      _id:       new mongoose.Types.ObjectId(medicationId),
      patientId: new mongoose.Types.ObjectId(patientId),
    }).lean();

    if (!medication) {
      return notFoundResponse('Medication');
    }

    const doseLog = await DoseLog.create({
      medicationId: new mongoose.Types.ObjectId(medicationId),
      patientId:    new mongoose.Types.ObjectId(patientId),
      scheduledAt:  new Date(scheduledAt),
      takenAt:      takenAt ? new Date(takenAt) : null,
      status,
    });

    return successDataResponse(doseLog.toObject(), 201);
  } catch (err) {
    console.error('[POST /api/medications/dose]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const POST = withAuth(handler);
