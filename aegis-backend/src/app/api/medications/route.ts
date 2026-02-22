import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import {
  successDataResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/response';
import Medication, { type IMedication } from '@/models/Medication.model';
import { medicationSchema } from '@/schemas/medication.schema';
import mongoose from 'mongoose';

async function getHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') !== 'false';

    const query: Record<string, unknown> = {
      patientId: new mongoose.Types.ObjectId(patientId),
    };
    if (activeOnly) query.isActive = true;

    const medications = await Medication.find(query)
      .sort({ createdAt: -1 })
      .lean<IMedication[]>();

    return successDataResponse(medications);
  } catch (err) {
    console.error('[GET /api/medications]', err);
    return errorResponse('Internal server error', 500);
  }
}

async function postHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;

    const body: unknown = await req.json();
    const parsed = medicationSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const { startDate, endDate, ...rest } = parsed.data;

    const medication = await Medication.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      ...rest,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate:   endDate   ? new Date(endDate)   : null,
    });

    return successDataResponse(medication.toObject(), 201);
  } catch (err) {
    console.error('[POST /api/medications]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
