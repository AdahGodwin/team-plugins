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

async function getMeHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    if (req.user.role !== 'admin') {
      return unauthorizedResponse('Access restricted to admin accounts');
    }

    const { userId } = req.user;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) return notFoundResponse('User');

    const admin = await Admin.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean<IAdmin>();
    if (!admin) return notFoundResponse('Admin profile');

    return successDataResponse({
      id:       userId,
      adminId:  (admin._id as mongoose.Types.ObjectId).toString(),
      fullName: `${admin.title} ${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName:  user.lastName,
      title:     admin.title,
      email:     user.email,
      role:      user.role,
      isVerified: admin.isVerified,

      // Credentials
      specialty:     admin.specialty,
      licenseNumber: admin.licenseNumber,
      department:    admin.department,
      jobTitle:      admin.jobTitle,

      // Hospital
      hospitalName:    admin.hospitalName,
      hospitalAddress: admin.hospitalAddress,
      hospitalPhone:   admin.hospitalPhone,
      hospitalEmail:   admin.hospitalEmail,
      registrationNo:  admin.registrationNo,

      createdAt: admin.createdAt
        ? new Date(admin.createdAt).toISOString()
        : null,
    });
  } catch (err) {
    console.error('[GET /api/admin/me]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getMeHandler);
