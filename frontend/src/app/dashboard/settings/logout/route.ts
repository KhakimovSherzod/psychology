// app/dashboard/settings/logout/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(new URL('/', 'http://localhost:3000'))

  // Clear cookies
  response.cookies.set({
    name: 'access_token',
    value: '',
    path: '/',
    httpOnly: true,
    expires: new Date(0),
  })

  response.cookies.set({
    name: 'refresh_token',
    value: '',
    path: '/',
    httpOnly: true,
    expires: new Date(0),
  })

  return response
}
