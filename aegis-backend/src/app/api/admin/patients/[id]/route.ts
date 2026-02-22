import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import {
  successDataResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/response';
import Admin, { type IAdmin } from '@/models/Admin.model';
import Patient, { type IPatient } from '@/models/Patient.model';
import User from '@/models/User.model';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { z } from 'zod';

type ResolveError  = { ok: false; response: NextResponse };
type ResolveOk     = { ok: true;  admin: IAdmin; patient: IPatient };
type ResolveResult = ResolveError | ResolveOk;

async function resolveAdminAndPatient(
  req: AuthenticatedRequest,
  patientId: string,
): Promise<ResolveResult> {
  if (req.user.role !== 'admin') {
    return { ok: false, response: unauthorizedResponse('Access restricted to admin accounts') };
  }

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return { ok: false, response: errorResponse('Invalid patient ID', 400) };
  }

  const adminId = req.user.patientId; 
  const admin   = await Admin.findById(adminId).lean<IAdmin>();
  if (!admin) {
    return { ok: false, response: notFoundResponse('Admin profile') };
  }

  const patient = await Patient.findById(patientId).lean<IPatient>();
  if (!patient) {
    return { ok: false, response: notFoundResponse('Patient') };
  }

  if (
    !patient.hospitalId ||
    patient.hospitalId.toString() !== (admin.hospitalId as mongoose.Types.ObjectId).toString()
  ) {
    return { ok: false, response: unauthorizedResponse('This patient does not belong to your hospital') };
  }

  return { ok: true, admin, patient };
}


// ── GET /api/admin/patients/[id] ─────────────────────────────────────────────
async function getHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<Record<string, string>> },
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params;
    const result = await resolveAdminAndPatient(req, id);
    if (!result.ok) return result.response;

    const { patient } = result;

    const user = await User.findById(patient.userId)
      .select('firstName lastName email createdAt')
      .lean();

    return successDataResponse({
      id:          (patient._id as mongoose.Types.ObjectId).toString(),
      userId:      (patient.userId as mongoose.Types.ObjectId).toString(),
      firstName:   user?.firstName  ?? null,
      lastName:    user?.lastName   ?? null,
      fullName:    user ? `${user.firstName} ${user.lastName}` : null,
      email:       user?.email      ?? null,
      registeredAt: user?.createdAt ? new Date(user.createdAt).toISOString() : null,

      // Patient profile
      phoneNumber:   patient.phoneNumber   ?? null,
      gender:        patient.gender        ?? null,
      dateOfBirth:   patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toISOString().split('T')[0]
        : null,
      address:       patient.address       ?? null,
      bloodGroup:    patient.bloodGroup    ?? null,
      allergies:     patient.allergies     ?? [],
      smokingStatus: patient.smokingStatus,
      diabetic:      patient.diabetic,
      weight:        patient.weight        ?? null,
      height:        patient.height        ?? null,

      // Next of kin / caregiver
      caregiverName:  patient.caregiverName  ?? null,
      caregiverEmail: patient.caregiverEmail ?? null,
      caregiverPhone: patient.caregiverPhone ?? null,

      // Consent
      consentHealth: patient.consentHealth,
      consentTerms:  patient.consentTerms,

      // Hospital link
      hospitalId: patient.hospitalId
        ? (patient.hospitalId as mongoose.Types.ObjectId).toString()
        : null,
    });
  } catch (err) {
    console.error('[GET /api/admin/patients/:id]', err);
    return errorResponse('Internal server error', 500);
  }
}

// ── PATCH /api/admin/patients/[id] ───────────────────────────────────────────
const updateSchema = z.object({
  // User fields
  firstName: z.string().min(1).trim().optional(),
  lastName:  z.string().min(1).trim().optional(),

  // Patient fields
  phoneNumber:   z.string().min(7).optional(),
  gender:        z.enum(['Male', 'Female', 'Other']).optional(),
  dateOfBirth:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format').optional(),
  address:       z.string().optional(),
  bloodGroup:    z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional(),
  allergies:     z.array(z.string()).optional(),
  smokingStatus: z.enum(['never', 'former', 'current']).optional(),
  diabetic:      z.boolean().optional(),
  weight:        z.number().positive().optional(),
  height:        z.number().positive().optional(),

  // Caregiver
  caregiverName:  z.string().optional(),
  caregiverEmail: z.string().email().optional(),
  caregiverPhone: z.string().optional(),
});

async function patchHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<Record<string, string>> },
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params;
    const result = await resolveAdminAndPatient(req, id);
    if (!result.ok) return result.response;

    const { patient } = result;

    const body: unknown = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const {
      firstName, lastName,
      dateOfBirth,
      ...patientFields
    } = parsed.data;

    // ── Update User document (name fields) ──────────────────────────────────
    if (firstName !== undefined || lastName !== undefined) {
      await User.findByIdAndUpdate(patient.userId, {
        ...(firstName !== undefined && { firstName }),
        ...(lastName  !== undefined && { lastName  }),
      });
    }

    // ── Update Patient document ─────────────────────────────────────────────
    const patientUpdate: Record<string, unknown> = { ...patientFields };
    if (dateOfBirth !== undefined) {
      patientUpdate.dateOfBirth = new Date(dateOfBirth);
    }

    const updated = await Patient.findByIdAndUpdate(
      id,
      { $set: patientUpdate },
      { new: true },
    ).lean<IPatient>();

    const user = await User.findById(patient.userId)
      .select('firstName lastName email')
      .lean();

    return successDataResponse({
      id:          (updated!._id as mongoose.Types.ObjectId).toString(),
      firstName:   user?.firstName  ?? null,
      lastName:    user?.lastName   ?? null,
      fullName:    user ? `${user.firstName} ${user.lastName}` : null,
      email:       user?.email      ?? null,
      phoneNumber:   updated!.phoneNumber   ?? null,
      gender:        updated!.gender        ?? null,
      dateOfBirth:   updated!.dateOfBirth
        ? new Date(updated!.dateOfBirth).toISOString().split('T')[0]
        : null,
      address:       updated!.address       ?? null,
      bloodGroup:    updated!.bloodGroup    ?? null,
      allergies:     updated!.allergies     ?? [],
      smokingStatus: updated!.smokingStatus,
      diabetic:      updated!.diabetic,
      weight:        updated!.weight        ?? null,
      height:        updated!.height        ?? null,
      caregiverName:  updated!.caregiverName  ?? null,
      caregiverEmail: updated!.caregiverEmail ?? null,
      caregiverPhone: updated!.caregiverPhone ?? null,
    });
  } catch (err) {
    console.error('[PATCH /api/admin/patients/:id]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET   = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
