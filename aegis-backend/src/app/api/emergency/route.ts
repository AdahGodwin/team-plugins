import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successDataResponse, unauthorizedResponse } from '@/lib/response';
import { getAllEmergencies } from '@/lib/emergencyStore';
import type { EmergencyStatus } from '@/lib/emergencyStore';
import { NextResponse } from 'next/server';

// ── GET /api/emergency?status=PENDING|ACKNOWLEDGED|RESOLVED ──────────────────
// Admin only — returns all emergencies, optionally filtered by status
async function handler(req: AuthenticatedRequest): Promise<NextResponse> {
  if (req.user.role !== 'admin') {
    return unauthorizedResponse('Access restricted to admin accounts');
  }

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get('status')?.toUpperCase() as EmergencyStatus | null;

  const all = getAllEmergencies();
  const filtered = statusParam
    ? all.filter((e) => e.status === statusParam)
    : all;

  return successDataResponse({
    emergencies: filtered,
    total: filtered.length,
  });
}

export const GET = withAuth(handler);
