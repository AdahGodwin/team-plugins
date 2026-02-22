import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successDataResponse, errorResponse, notFoundResponse } from '@/lib/response';
import VitalLog, { type IVitalLog } from '@/models/VitalLog.model';
import mongoose from 'mongoose';

async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;

    const latest = await VitalLog.findOne({
      patientId: new mongoose.Types.ObjectId(patientId),
    })
      .sort({ loggedAt: -1 })
      .lean<IVitalLog>();

    if (!latest) {
      return notFoundResponse('Vital log');
    }

    return successDataResponse(latest);
  } catch (err) {
    console.error('[GET /api/vitals/latest]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(handler);
