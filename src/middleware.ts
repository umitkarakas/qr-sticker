import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * When sitting behind Cloudflare + OpenLiteSpeed, both proxies add
 * X-Forwarded-Proto / X-Forwarded-For headers. Node.js joins duplicates
 * with ", " so NextAuth receives "https, https" and throws Invalid URL.
 * Strip each forwarding header down to its first value before any
 * route handler or NextAuth code sees the request.
 */
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  let changed = false;

  for (const key of ['x-forwarded-proto', 'x-forwarded-host', 'x-forwarded-for']) {
    const val = headers.get(key);
    if (val && val.includes(',')) {
      headers.set(key, val.split(',')[0].trim());
      changed = true;
    }
  }

  if (!changed) return NextResponse.next();
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
