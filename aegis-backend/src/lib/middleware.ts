import { type NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, type AccessTokenPayload } from './auth';
import { unauthorizedResponse } from './response';

export interface AuthenticatedRequest extends NextRequest {
  user: AccessTokenPayload;
}

type RouteHandler = (
  req: AuthenticatedRequest,
  context: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

export function withAuth(handler: RouteHandler): RouteHandler {
  return async (req: AuthenticatedRequest, context) => {
    try {
      const authHeader = req.headers.get('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return unauthorizedResponse('Missing or malformed Authorization header');
      }

      const token = authHeader.slice(7);

      const payload = await verifyAccessToken(token);
      req.user = payload;

      return handler(req, context);
    } catch {
      return unauthorizedResponse('Invalid or expired token');
    }
  };
}
