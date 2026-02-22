import { type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/response';
import User from '@/models/User.model';
import Admin from '@/models/Admin.model';
import Hospital from '@/models/Hospital.model';
import { createAdminSchema } from '@/schemas/admin.schema';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body: unknown = await req.json();
    const parsed = createAdminSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const {
      firstName,
      lastName,
      title,
      email,
      password,
      specialty,
      licenseNumber,
      department,
      jobTitle,
      hospitalName,
      hospitalAddress,
      hospitalPhone,
      hospitalEmail,
      registrationNo,
    } = parsed.data;

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return errorResponse('An account with this email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingHospital = await Hospital.findOne({ registrationNo }).lean();
    const hospital = existingHospital ?? await Hospital.create({
      name:    hospitalName,
      address: hospitalAddress,
      phone:   hospitalPhone,
      email:   hospitalEmail,
      registrationNo,
    });
    const hospitalId = (hospital._id as { toString(): string }).toString();

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    const admin = await Admin.create({
      userId:     user._id,
      hospitalId: hospital._id,
      title,
      specialty,
      licenseNumber,
      department,
      jobTitle,
      hospitalName,
      hospitalAddress,
      hospitalPhone,
      hospitalEmail,
      registrationNo,
      isVerified: false,
    });

    const userId  = (user._id  as { toString(): string }).toString();
    const adminId = (admin._id as { toString(): string }).toString();

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId, role: user.role, patientId: adminId }),
      signRefreshToken({ userId }),
    ]);

    return successResponse(
      {
        accessToken,
        refreshToken,
        user: {
          id:         userId,
          adminId,
          hospitalId,
          fullName:   `${title} ${firstName} ${lastName}`,
          email:      user.email,
          role:       user.role,
          hospitalName,
          specialty,
          jobTitle,
          isVerified: admin.isVerified,
        },
      },
      201,
    );
  } catch (err) {
    console.error('[POST /api/admin/register]', err);
    return errorResponse('Internal server error', 500);
  }
}
