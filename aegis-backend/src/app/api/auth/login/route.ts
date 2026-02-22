import { type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/lib/response';
import User from '@/models/User.model';
import Patient from '@/models/Patient.model';
import Admin from '@/models/Admin.model';
import { loginSchema } from '@/schemas/auth.schema';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body: unknown = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return notFoundResponse('User');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse('Invalid email or password', 401);
    }

    const userId = (user._id as { toString(): string }).toString();

    if (user.role === 'admin') {
      const admin = await Admin.findOne({ userId: user._id }).lean();
      if (!admin) {
        return errorResponse('Admin profile not found', 404);
      }

      const adminId = (admin._id as { toString(): string }).toString();

      const [accessToken, refreshToken] = await Promise.all([
        signAccessToken({ userId, role: user.role, patientId: adminId }),
        signRefreshToken({ userId }),
      ]);

      return successResponse({
        accessToken,
        refreshToken,
        user: {
          id:          userId,
          adminId,
          hospitalId:  admin.hospitalId
            ? (admin.hospitalId as mongoose.Types.ObjectId).toString()
            : null,
          fullName:    `${admin.title} ${user.firstName} ${user.lastName}`,
          email:       user.email,
          role:        user.role,
          isVerified:  admin.isVerified,
          hospitalName: admin.hospitalName,
          specialty:    admin.specialty,
          jobTitle:     admin.jobTitle,
        },
      });
    }

    const patient = await Patient.findOne({ userId: user._id }).lean();
    if (!patient) {
      return errorResponse('Patient profile not found', 404);
    }

    const patientId = (patient._id as { toString(): string }).toString();

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId, role: user.role, patientId }),
      signRefreshToken({ userId }),
    ]);

    return successResponse({
      accessToken,
      refreshToken,
      user: {
        id:         userId,
        patientId,
        hospitalId: patient.hospitalId
          ? (patient.hospitalId as mongoose.Types.ObjectId).toString()
          : null,
        fullName:   `${user.firstName} ${user.lastName}`,
        email:      user.email,
        role:       user.role,
      },
    });
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    return errorResponse('Internal server error', 500);
  }
}
