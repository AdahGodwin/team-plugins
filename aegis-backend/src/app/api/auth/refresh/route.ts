import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/response';
import User from '@/models/User.model';
import Patient from '@/models/Patient.model';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json() as { refreshToken?: string };
    const { refreshToken } = body;

    if (!refreshToken) {
      return unauthorizedResponse('Refresh token is required');
    }

    const payload = await verifyRefreshToken(refreshToken);
    const userId = payload.userId as string;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return unauthorizedResponse('User not found');
    }

    const patient = await Patient.findOne({ userId: user._id }).lean();
    if (!patient) {
      return errorResponse('Patient profile not found', 404);
    }

    const patientId = (patient._id as { toString(): string }).toString();
    const userIdStr = (user._id as { toString(): string }).toString();

    const [newAccessToken, newRefreshToken] = await Promise.all([
      signAccessToken({ userId: userIdStr, role: user.role, patientId }),
      signRefreshToken({ userId: userIdStr }),
    ]);

    return successResponse({
      accessToken:  newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id:       userIdStr,
        patientId,
        fullName: `${user.firstName} ${user.lastName}`,
        email:    user.email,
        role:     user.role,
      },
    });
  } catch (err) {
    console.error('[POST /api/auth/refresh]', err);
    return unauthorizedResponse('Invalid or expired refresh token');
  }
}
