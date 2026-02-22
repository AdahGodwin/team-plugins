import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successDataResponse, errorResponse, notFoundResponse } from '@/lib/response';
import Patient, { type IPatient } from '@/models/Patient.model';
import User from '@/models/User.model';
import mongoose from 'mongoose';

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
}

async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { patientId } = req.user;

    const patient = await Patient.findById(patientId).lean<IPatient>();
    if (!patient) {
      return notFoundResponse('Patient');
    }

    const user = await User.findById(patient.userId)
      .select('-password')
      .lean();
    if (!user) {
      return notFoundResponse('User');
    }

    const fullName = `${user.firstName} ${user.lastName}`;
    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

    const age = patient.dateOfBirth ? calculateAge(new Date(patient.dateOfBirth)) : null;

    return successDataResponse({
      id:             (patient._id as mongoose.Types.ObjectId).toString(),
      fullName,
      initials,
      email:          user.email,
      phoneNumber:    patient.phoneNumber ?? null,
      gender:         patient.gender ?? null,
      dateOfBirth:    patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toISOString().split('T')[0]
        : null,
      age,
      address:        patient.address ?? null,
      bloodGroup:     patient.bloodGroup ?? null,
      allergies:      patient.allergies ?? [],
      smokingStatus:  patient.smokingStatus,
      diabetic:       patient.diabetic,
      weight:         patient.weight ?? null,
      caregiverName:  patient.caregiverName ?? null,
      caregiverEmail: patient.caregiverEmail ?? null,
      caregiverPhone: patient.caregiverPhone ?? null,
      dateJoined:     patient.createdAt ? new Date(patient.createdAt).toISOString() : null,
    });
  } catch (err) {
    console.error('[GET /api/patient/overview]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(handler);
