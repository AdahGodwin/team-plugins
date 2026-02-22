import { type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/response';
import User from '@/models/User.model';
import Patient from '@/models/Patient.model';
import { registerSchema } from '@/schemas/auth.schema';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body: unknown = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      kinName,
      kinPhone,
      kinEmail,
      hospitalId,
      consentHealth,
      consentTerms,
    } = parsed.data;

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return errorResponse('An account with this email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'patient',
    });

    const patient = await Patient.create({
      userId:         user._id,
      phoneNumber,
      hospitalId:     hospitalId ? new mongoose.Types.ObjectId(hospitalId) : null,
      caregiverName:  kinName,
      caregiverPhone: kinPhone,
      caregiverEmail: kinEmail || undefined,
      consentHealth,
      consentTerms,
    });

    const patientId = (patient._id as { toString(): string }).toString();
    const userId = (user._id as { toString(): string }).toString();

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId, role: user.role, patientId }),
      signRefreshToken({ userId }),
    ]);

    return successResponse(
      {
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
      },
      201,
    );
  } catch (err) {
    console.error('[POST /api/auth/register]', err);
    return errorResponse('Internal server error', 500);
  }
}
