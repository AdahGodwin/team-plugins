import { type NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, type AccessTokenPayload } from './auth';
import { unauthorizedResponse } from './response';

export interface AuthenticatedRequest extends NextRequest {
  user: AccessTokenPayload;
}

type AuthedHandler = (
  req: AuthenticatedRequest,
  context: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

// Return type uses NextRequest so Next.js build is satisfied; we cast internally.
type NextRouteHandler = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

export function withAuth(handler: AuthedHandler): NextRouteHandler {
  return async (req: NextRequest, context) => {
    try {
      const authHeader = req.headers.get('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return unauthorizedResponse('Missing or malformed Authorization header');
      }

      const token = authHeader.slice(7);

      const payload = await verifyAccessToken(token);
      const authedReq = req as AuthenticatedRequest;
      authedReq.user = payload;

      return handler(authedReq, context);
    } catch {
      return unauthorizedResponse('Invalid or expired token');
    }
  };
}
