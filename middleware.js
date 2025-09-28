import { NextResponse } from 'next/server';

// Simple middleware without NextAuth
export function middleware(request) {
  // For now, allow all requests to pass through
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};