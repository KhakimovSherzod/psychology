// lib/auth.ts
import { cookies } from 'next/headers'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = await cookies()

    const accessToken = cookieStore.get('access_token')?.value
    const refreshToken = cookieStore.get('refresh_token')?.value

    const cookieHeader = [
      accessToken ? `access_token=${accessToken}` : '',
      refreshToken ? `refresh_token=${refreshToken}` : '',
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
    console.log('Fetch user response status:', res)
    const user = (await res.json())?.user
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
