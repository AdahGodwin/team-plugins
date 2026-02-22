import { connectDB } from '@/lib/db';
import { successDataResponse, errorResponse } from '@/lib/response';
import Hospital, { type IHospital } from '@/models/Hospital.model';
import { type NextRequest } from 'next/server';
import mongoose from 'mongoose';

// ── GET /api/hospitals ────────────────────────────────────────────────────────
// Public — used by patient registration dropdown
export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    const hospitals = await Hospital.find({ isActive: true })
      .select('_id name address phone email registrationNo')
      .sort({ name: 1 })
      .lean<IHospital[]>();

    return successDataResponse(
      hospitals.map((h) => ({
        id:             (h._id as mongoose.Types.ObjectId).toString(),
        name:           h.name,
        address:        h.address,
        phone:          h.phone,
        email:          h.email,
        registrationNo: h.registrationNo,
      })),
    );
  } catch (err) {
    console.error('[GET /api/hospitals]', err);
    return errorResponse('Internal server error', 500);
  }
}
