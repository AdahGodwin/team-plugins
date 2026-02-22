import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { errorResponse, notFoundResponse } from '@/lib/response';
import { getEmergencyById } from '@/lib/emergencyStore';
import { NextResponse } from 'next/server';

// ── GET /api/emergency/[id] ───────────────────────────────────────────────────
// Auth required — patient can only view their own emergency;
// admins can view any emergency.
async function handler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<Record<string, string>> },
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id) return errorResponse('Emergency ID is required', 400);

    const emergency = getEmergencyById(id);
    if (!emergency) return notFoundResponse('Emergency');

    // Patients may only fetch their own emergencies
    if (
      req.user.role === 'patient' &&
      req.user.patientId !== emergency.patientId
    ) {
      return NextResponse.json(
        { success: false, error: 'Access denied.' },
        { status: 403 },
      );
    }

    return NextResponse.json({ success: true, data: emergency }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/emergency/:id]', err);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(handler);
