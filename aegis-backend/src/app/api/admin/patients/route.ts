import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import {
  successDataResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from '@/lib/response';
import Admin, { type IAdmin } from '@/models/Admin.model';
import Patient, { type IPatient } from '@/models/Patient.model';
import User from '@/models/User.model';
import mongoose from 'mongoose';

async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    if (req.user.role !== 'admin') {
      return unauthorizedResponse('Access restricted to admin accounts');
    }

    const adminId = req.user.patientId;
    const admin = await Admin.findById(adminId).lean<IAdmin>();
    if (!admin) {
      return notFoundResponse('Admin profile');
    }

    if (!admin.hospitalId) {
      return errorResponse(
        'Your admin account is not linked to a hospital. Please contact support.',
        422,
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() ?? '';
    const page   = Math.max(1, parseInt(searchParams.get('page')  ?? '1',  10));
    const limit  = Math.min(100, parseInt(searchParams.get('limit') ?? '20', 10));
    const skip   = (page - 1) * limit;

    const hospitalOid = new mongoose.Types.ObjectId(
      (admin.hospitalId as mongoose.Types.ObjectId).toString(),
    );

    let userIdFilter: mongoose.Types.ObjectId[] | null = null;
    if (search) {
      const regex = new RegExp(search, 'i');
      const matchingUsers = await User.find({
        $or: [
          { firstName: regex },
          { lastName:  regex },
          { email:     regex },
        ],
      })
        .select('_id')
        .lean();
      userIdFilter = matchingUsers.map((u) => u._id as mongoose.Types.ObjectId);
    }

    const query: Record<string, unknown> = { hospitalId: hospitalOid };
    if (userIdFilter !== null) {
      query.userId = { $in: userIdFilter };
    }

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean<IPatient[]>(),
      Patient.countDocuments(query),
    ]);

    if (!patients.length) {
      return successDataResponse({ total, page, limit, patients: [] });
    }

    const enriched = await Promise.all(
      patients.map(async (p) => {
        const user = await User.findById(p.userId)
          .select('firstName lastName email createdAt')
          .lean();

        return {
          id:         (p._id as mongoose.Types.ObjectId).toString(),
          userId:     (p.userId as mongoose.Types.ObjectId).toString(),
          fullName:   user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          firstName:  user?.firstName ?? null,
          lastName:   user?.lastName  ?? null,
          email:      user?.email     ?? null,
          phoneNumber:   p.phoneNumber  ?? null,
          gender:        p.gender       ?? null,
          dateOfBirth:   p.dateOfBirth
            ? new Date(p.dateOfBirth).toISOString().split('T')[0]
            : null,
          bloodGroup:    p.bloodGroup   ?? null,
          smokingStatus: p.smokingStatus,
          diabetic:      p.diabetic,
          weight:        p.weight  ?? null,
          height:        p.height  ?? null,
          caregiverName:  p.caregiverName  ?? null,
          caregiverPhone: p.caregiverPhone ?? null,
          registeredAt:   p.createdAt
            ? new Date(p.createdAt).toISOString()
            : null,
        };
      }),
    );

    return successDataResponse({
      total,
      page,
      limit,
      patients: enriched,
    });
  } catch (err) {
    console.error('[GET /api/admin/patients]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(handler);
