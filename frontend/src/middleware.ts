import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value
  const refreshToken = req.cookies.get('refreshToken')?.value

  // Skip middleware for non-page requests (optional but recommended)
  const isPageRequest = req.headers.get('accept')?.includes('text/html')
  if (!isPageRequest) {
    return NextResponse.next()
  }

  // If access token exists → allow request
  if (accessToken) {
    return NextResponse.next()
  }

  // If no refresh token → redirect to login
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    // Call your Next.js refresh route (proxy to backend)
    const refreshRes = await fetch('http://localhost:3001/public/refresh-token', {
      method: 'POST',
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    })

    // If refresh failed → redirect to login
    if (!refreshRes.ok) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const response = NextResponse.next()

    // 🔥 Forward cookies from refresh response to browser
    const setCookie = refreshRes.headers.get('set-cookie')

    if (setCookie) {
      response.headers.set('set-cookie', setCookie)
    }

    return response
  } catch (err) {
    console.error('Middleware refresh error:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
