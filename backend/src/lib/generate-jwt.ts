import type { Response } from 'express'
import jwt from 'jsonwebtoken'

type GenerateAccessTokenProps = {
  uuid: string
  role: string
  res: Response
}

export async function generateAccessToken({ uuid, role, res }: GenerateAccessTokenProps) {
  const accessToken = jwt.sign({ sub: uuid, role }, process.env.JWT_SECRET as string, {
    expiresIn: '15m',
  })

  if (accessToken) {
    // Set cookie directly in the response
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
      path: '/',
    })
    console.log('access token set in cookies')
  }

  return accessToken
}

export async function generateRefreshToken({ uuid, res }: { uuid: string; res: Response }) {
  const refreshToken = jwt.sign({ sub: uuid }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  })

  if (refreshToken) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 31 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
      path: '/',
    })
    console.log('cookies were set')
  } else {
    console.error('error occured when created refresh token')
  }

  return refreshToken
}
