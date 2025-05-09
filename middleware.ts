import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // API 라우트 보호
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/posts/:path*',
    '/api/likes/:path*',
    '/api/comments/:path*',
    '/api/upload/:path*',
  ],
}
