import { connectDB } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { errorResponse, validationErrorResponse } from '@/lib/response';
import { createEmergency } from '@/lib/emergencyStore';
import Patient, { type IPatient } from '@/models/Patient.model';
import Hospital, { type IHospital } from '@/models/Hospital.model';
import User from '@/models/User.model';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const triggerSchema = z.object({
  patientId: z.string().min(1, 'patientId is required'),
  symptoms:  z.array(z.string()).optional().default([]),
  message:   z.string().optional().default(''),
});

// ── POST /api/emergency/trigger ───────────────────────────────────────────────
// Auth required — patient triggers their own SOS.
// The token's patientId must match the requested patientId.
async function handler(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body: unknown = await req.json();
    const parsed = triggerSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const { patientId, symptoms, message } = parsed.data;

    // ── Security: patient can only trigger their own SOS ─────────────────────
    // Admins can trigger on behalf of any patient in their hospital (future use).
    if (req.user.role === 'patient' && req.user.patientId !== patientId) {
      return NextResponse.json(
        { success: false, error: 'You can only trigger an SOS for your own account.' },
        { status: 403 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return errorResponse('Invalid patientId', 400);
    }

    // ── Load patient record ───────────────────────────────────────────────────
    const patient = await Patient.findById(patientId).lean<IPatient>();
    if (!patient) {
      return errorResponse('Patient not found', 404);
    }

    // ── Load user (for name) ──────────────────────────────────────────────────
    const user = await User.findById(patient.userId)
      .select('firstName lastName')
      .lean();
    const patientName = user
      ? `${user.firstName} ${user.lastName}`
      : 'Unknown Patient';

    // ── Load hospital name (optional) ─────────────────────────────────────────
    let clinicName: string | undefined;
    if (patient.hospitalId) {
      const hospital = await Hospital.findById(patient.hospitalId)
        .select('name')
        .lean<IHospital>();
      clinicName = hospital?.name;
    }

    // ── Create emergency record + notifications ───────────────────────────────
    const emergency = createEmergency({
      patientId,
      patientName,
      reportedSymptoms: symptoms,
      message:          message || '',
      caregiverName:    patient.caregiverName,
      clinicName,
    });

    // ── Build recipient summary for response message ──────────────────────────
    const recipients: string[] = [];
    if (patient.caregiverName) recipients.push(`caregiver (${patient.caregiverName})`);
    if (clinicName)            recipients.push(`clinic (${clinicName})`);

    const alertMessage =
      recipients.length > 0
        ? `Emergency alert sent to ${recipients.join(' and ')}.`
        : 'Emergency recorded. No caregiver or clinic is currently linked to your account.';

    return NextResponse.json(
      {
        success:     true,
        emergencyId: emergency.id,
        message:     alertMessage,
        timestamp:   emergency.timestamp,
        nextSteps: [
          'Contact emergency services immediately if symptoms are severe.',
          'Remain calm and wait for assistance.',
          'Keep the patient still and do not give them food or water.',
          'Note the time symptoms started — this is critical for stroke treatment.',
        ],
      },
      { status: 201 },
    );
  } catch (err) {
    console.error('[POST /api/emergency/trigger]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const POST = withAuth(handler);
