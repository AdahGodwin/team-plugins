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

async function handler(req: AuthenticatedRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body: unknown = await req.json();
    const parsed = triggerSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const { patientId, symptoms, message } = parsed.data;

    if (req.user.role === 'patient' && req.user.patientId !== patientId) {
      return NextResponse.json(
        { success: false, error: 'You can only trigger an SOS for your own account.' },
        { status: 403 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return errorResponse('Invalid patientId', 400);
    }

    const patient = await Patient.findById(patientId).lean<IPatient>();
    if (!patient) {
      return errorResponse('Patient not found', 404);
    }

    const user = await User.findById(patient.userId)
      .select('firstName lastName phoneNumber')
      .lean();
    const patientName  = user ? `${user.firstName} ${user.lastName}` : 'Unknown Patient';
    const patientPhone = (user as any)?.phoneNumber ?? patient.phoneNumber ?? undefined;

    let clinicName: string | undefined;
    if (patient.hospitalId) {
      const hospital = await Hospital.findById(patient.hospitalId)
        .select('name phone')
        .lean<IHospital>();
      clinicName = hospital?.name;
    }

    const emergency = createEmergency({
      patientId,
      patientName,
      patientPhone,
      reportedSymptoms: symptoms,
      message:          message || '',
      caregiverName:    patient.caregiverName,
      caregiverPhone:   patient.caregiverPhone,
      clinicName,
    });

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
        triggeredAt: emergency.triggeredAt,
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
