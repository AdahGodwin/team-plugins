import { NextResponse } from 'next/server';

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, ...( typeof data === 'object' && data !== null && !Array.isArray(data) ? data : { data }) }, { status });
}

export function successDataResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function validationErrorResponse(errors: unknown): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Validation failed', details: errors },
    { status: 422 },
  );
}

export function unauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function notFoundResponse(resource = 'Resource'): NextResponse {
  return NextResponse.json(
    { success: false, error: `${resource} not found` },
    { status: 404 },
  );
}
