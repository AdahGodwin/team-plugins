import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successDataResponse, errorResponse, notFoundResponse } from '@/lib/response';
import User from '@/models/User.model';
import Patient, { type IPatient } from '@/models/Patient.model';
import Admin, { type IAdmin } from '@/models/Admin.model';
import mongoose from 'mongoose';

async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    const { userId, patientId, role } = req.user;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return notFoundResponse('User');
    }

    // ── Admin branch ──────────────────────────────────────────────────────────
    if (role === 'admin') {
      const admin = await Admin.findById(patientId).lean<IAdmin>();
      return successDataResponse({
        id:        userId,
        adminId:   patientId ?? null,
        hospitalId: admin?.hospitalId
          ? (admin.hospitalId as mongoose.Types.ObjectId).toString()
          : null,
        firstName: user.firstName,
        lastName:  user.lastName,
        fullName:  admin
          ? `${admin.title} ${user.firstName} ${user.lastName}`
          : `${user.firstName} ${user.lastName}`,
        initials:  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase(),
        email:     user.email,
        role:      user.role,
        title:       admin?.title       ?? null,
        jobTitle:    admin?.jobTitle    ?? null,
        specialty:   admin?.specialty   ?? null,
        department:  admin?.department  ?? null,
        hospitalName: admin?.hospitalName ?? null,
        isVerified:  admin?.isVerified  ?? false,
        createdAt: (user as { createdAt?: Date }).createdAt
          ? new Date((user as { createdAt?: Date }).createdAt!).toISOString()
          : null,
      });
    }

    // ── Patient branch ────────────────────────────────────────────────────────
    const patient = await Patient.findById(patientId).lean<IPatient>();

    return successDataResponse({
      id:        userId,
      patientId: patientId ?? null,
      hospitalId: patient?.hospitalId
        ? (patient.hospitalId as mongoose.Types.ObjectId).toString()
        : null,
      firstName: user.firstName,
      lastName:  user.lastName,
      fullName:  `${user.firstName} ${user.lastName}`,
      initials:  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase(),
      email:     user.email,
      role:      user.role,
      createdAt: (user as { createdAt?: Date }).createdAt
        ? new Date((user as { createdAt?: Date }).createdAt!).toISOString()
        : null,

      phoneNumber:    patient?.phoneNumber   ?? null,
      gender:         patient?.gender        ?? null,
      dateOfBirth:    patient?.dateOfBirth
        ? new Date(patient.dateOfBirth).toISOString().split('T')[0]
        : null,
      bloodGroup:     patient?.bloodGroup    ?? null,
      allergies:      patient?.allergies     ?? [],
      smokingStatus:  patient?.smokingStatus ?? null,
      diabetic:       patient?.diabetic      ?? null,
      weight:         patient?.weight        ?? null,
      height:         patient?.height        ?? null,
      address:        patient?.address       ?? null,
      caregiverName:  patient?.caregiverName  ?? null,
      caregiverEmail: patient?.caregiverEmail ?? null,
      caregiverPhone: patient?.caregiverPhone ?? null,

      _patientMongoId: patient
        ? (patient._id as mongoose.Types.ObjectId).toString()
        : null,
    });
  } catch (err) {
    console.error('[GET /api/auth/me]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(handler);
