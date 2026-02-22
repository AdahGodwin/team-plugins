import { type NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',   // Vite dev frontend
  'http://localhost:3000',   // Next.js itself
  process.env.NEXT_PUBLIC_APP_URL ?? '',
  process.env.FRONTEND_URL  ?? '',
].filter(Boolean));

const CORS_HEADERS = {
  'Access-Control-Allow-Methods':  'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers':  'Content-Type,Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export function proxy(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  const isAllowed = ALLOWED_ORIGINS.has(origin);

  // Handle preflight (OPTIONS) — must respond 200/204 immediately
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin : '',
        ...CORS_HEADERS,
      },
    });
  }

  // Pass through and attach CORS headers to the real response
  const response = NextResponse.next();
  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
  }
  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
