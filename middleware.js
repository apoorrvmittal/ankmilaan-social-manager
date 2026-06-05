import { NextResponse } from 'next/server'

const SESSION_SECRET = process.env.SESSION_SECRET || 'ankmilaan-smm-secret-key-min32chars!!'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Allow auth routes and static files through
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get('smm_session')?.value

  if (!sessionToken) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // For pages, let through (login page handles redirect client-side)
    return NextResponse.next()
  }

  // Validate session
  try {
    const parts = sessionToken.split('.')
    if (parts.length < 2) throw new Error('Invalid session')
    const signature = parts[parts.length - 1]
    const token = parts.slice(0, -1).join('.')
    const expectedSig = Buffer.from(`${token}.${SESSION_SECRET}`).toString('base64').slice(0, 32)
    if (signature !== expectedSig) throw new Error('Invalid signature')
  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
