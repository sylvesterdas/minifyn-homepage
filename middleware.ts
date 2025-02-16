import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await request.cookies.get('token')?.value

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}