import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successDataResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/response';
import Patient, { type IPatient } from '@/models/Patient.model';
import User from '@/models/User.model';
import mongoose from 'mongoose';
import { z } from 'zod';

const profilePatchSchema = z.object({
  phoneNumber:    z.string().optional(),
  gender:         z.enum(['Male', 'Female', 'Other']).optional(),
  dateOfBirth:    z.string().optional(),
  address:        z.string().optional(),
  bloodGroup:     z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional(),
  allergies:      z.array(z.string()).optional(),
  smokingStatus:  z.enum(['never', 'former', 'current']).optional(),
  diabetic:       z.boolean().optional(),
  weight:         z.number().positive().optional(),
  height:         z.number().positive().optional(),
  caregiverName:  z.string().optional(),
  caregiverEmail: z.string().email().optional().or(z.literal('')),
  caregiverPhone: z.string().optional(),
});

async function getHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;

    const patient = await Patient.findById(patientId).lean<IPatient>();
    if (!patient) {
      return notFoundResponse('Patient');
    }

    const user = await User.findById(patient.userId).select('-password').lean();
    if (!user) {
      return notFoundResponse('User');
    }

    return successDataResponse({
      id:             (patient._id as mongoose.Types.ObjectId).toString(),
      userId:         (patient.userId as mongoose.Types.ObjectId).toString(),
      fullName:       `${user.firstName} ${user.lastName}`,
      email:          user.email,
      role:           user.role,
      phoneNumber:    patient.phoneNumber ?? null,
      gender:         patient.gender ?? null,
      dateOfBirth:    patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toISOString().split('T')[0]
        : null,
      address:        patient.address ?? null,
      bloodGroup:     patient.bloodGroup ?? null,
      allergies:      patient.allergies ?? [],
      smokingStatus:  patient.smokingStatus,
      diabetic:       patient.diabetic,
      weight:         patient.weight ?? null,
      height:         patient.height ?? null,
      caregiverName:  patient.caregiverName ?? null,
      caregiverEmail: patient.caregiverEmail ?? null,
      caregiverPhone: patient.caregiverPhone ?? null,
      createdAt:      patient.createdAt ? new Date(patient.createdAt).toISOString() : null,
    });
  } catch (err) {
    console.error('[GET /api/patient/profile]', err);
    return errorResponse('Internal server error', 500);
  }
}

async function patchHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;

    const body: unknown = await req.json();
    const parsed = profilePatchSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const updates = parsed.data;
    const dbUpdates: Record<string, unknown> = { ...updates };

    if (updates.dateOfBirth) {
      dbUpdates.dateOfBirth = new Date(updates.dateOfBirth);
    }
    if (updates.caregiverEmail === '') {
      dbUpdates.caregiverEmail = undefined;
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $set: dbUpdates },
      { new: true, runValidators: true },
    ).lean<IPatient>();

    if (!updatedPatient) {
      return notFoundResponse('Patient');
    }

    return successDataResponse(updatedPatient);
  } catch (err) {
    console.error('[PATCH /api/patient/profile]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
