import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import {
  successDataResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from '@/lib/response';
import Admin, { type IAdmin } from '@/models/Admin.model';
import User from '@/models/User.model';
import mongoose from 'mongoose';


async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    if (req.user.role !== 'admin') {
      return unauthorizedResponse('Access restricted to admin accounts');
    }

    const { searchParams } = new URL(req.url);
    const verifiedOnly = searchParams.get('verified') === 'true';
    const specialty    = searchParams.get('specialty');

    const query: Record<string, unknown> = {};
    if (verifiedOnly)  query.isVerified = true;
    if (specialty)     query.specialty  = { $regex: specialty, $options: 'i' };

    const admins = await Admin.find(query)
      .sort({ createdAt: -1 })
      .lean<IAdmin[]>();

    if (!admins.length) return notFoundResponse('Admins');

    const enriched = await Promise.all(
      admins.map(async (admin) => {
        const user = await User.findById(admin.userId)
          .select('firstName lastName email')
          .lean();

        return {
          id:       (admin._id as mongoose.Types.ObjectId).toString(),
          userId:   (admin.userId as mongoose.Types.ObjectId).toString(),
          fullName: user
            ? `${admin.title} ${user.firstName} ${user.lastName}`
            : admin.title,
          firstName: user?.firstName ?? null,
          lastName:  user?.lastName  ?? null,
          email:     user?.email     ?? null,

          title:         admin.title,
          specialty:     admin.specialty,
          licenseNumber: admin.licenseNumber,
          department:    admin.department,
          jobTitle:      admin.jobTitle,
          isVerified:    admin.isVerified,

          hospitalName:    admin.hospitalName,
          hospitalAddress: admin.hospitalAddress,
          hospitalPhone:   admin.hospitalPhone,
          hospitalEmail:   admin.hospitalEmail,
          registrationNo:  admin.registrationNo,

          createdAt: admin.createdAt
            ? new Date(admin.createdAt).toISOString()
            : null,
        };
      }),
    );

    return successDataResponse({ total: enriched.length, admins: enriched });
  } catch (err) {
    console.error('[GET /api/admin/list]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(handler);
