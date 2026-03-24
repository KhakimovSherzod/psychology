// lib/auth.ts
import { cookies } from 'next/headers'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = await cookies()

    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      const res = await fetch('http://localhost:3000/api/refreshToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `refreshToken=${cookieStore.get('refreshToken')?.value || ''}`,
        },
        cache: 'no-store',
      })
      console.log('Refresh token response:', res) // Debugging log
    }
    const refreshToken = cookieStore.get('refreshToken')?.value

    const cookieHeader = [
      accessToken ? `accessToken=${accessToken}` : '',
      refreshToken ? `refreshToken=${refreshToken}` : '',
    ]
      .filter(Boolean)
      .join('; ')


    const res = await fetch('http://localhost:3001/api/users/me', {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    })
    const user = await res.json()
    if (user) {
      return user
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
})
