import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { errorResponse, notFoundResponse } from '@/lib/response';
import { getEmergencyById, acknowledgeEmergency } from '@/lib/emergencyStore';
import { NextResponse } from 'next/server';

// ── POST /api/emergency/[id]/acknowledge ──────────────────────────────────────
// Admin or patient's caregiver (via admin token) acknowledges an emergency.
// For MVP: any authenticated admin can acknowledge any emergency.
// Patients can acknowledge their own.
async function handler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<Record<string, string>> },
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id) return errorResponse('Emergency ID is required', 400);

    const emergency = getEmergencyById(id);
    if (!emergency) return notFoundResponse('Emergency');

    // Patients can only acknowledge their own emergencies
    if (
      req.user.role === 'patient' &&
      req.user.patientId !== emergency.patientId
    ) {
      return NextResponse.json(
        { success: false, error: 'Access denied.' },
        { status: 403 },
      );
    }

    if (emergency.status === 'ACKNOWLEDGED') {
      return NextResponse.json(
        {
          success: true,
          message: 'Emergency was already acknowledged.',
          data:    emergency,
        },
        { status: 200 },
      );
    }

    const acknowledgedBy =
      req.user.role === 'admin'
        ? `admin:${req.user.patientId}` // patientId holds adminId for admin tokens
        : `patient:${req.user.patientId}`;

    const updated = acknowledgeEmergency(id, acknowledgedBy);

    return NextResponse.json(
      {
        success: true,
        message: 'Emergency acknowledged successfully.',
        data:    updated,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('[POST /api/emergency/:id/acknowledge]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const POST = withAuth(handler);
