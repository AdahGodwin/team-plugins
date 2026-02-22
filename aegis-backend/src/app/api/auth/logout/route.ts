import { type NextRequest } from 'next/server';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { successResponse, errorResponse } from '@/lib/response';

async function handler(_req: AuthenticatedRequest) {
  try {

    return successResponse({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('[POST /api/auth/logout]', err);
    return errorResponse('Internal server error', 500);
  }
}

export function POST(req: NextRequest) {
  return withAuth(handler)(req as AuthenticatedRequest, {
    params: Promise.resolve({}),
  });
}
