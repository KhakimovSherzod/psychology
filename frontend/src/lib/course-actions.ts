import { cookies } from 'next/headers'

// lib/course-actions.ts
export async function getCategories() {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get('access_token')?.value
  const refreshToken = cookieStore.get('refresh_token')?.value

  const cookieHeader = [
    accessToken ? `access_token=${accessToken}` : '',
    refreshToken ? `refresh_token=${refreshToken}` : '',
  ]
    .filter(Boolean)
    .join('; ')

  try {
    const response = await fetch('http://localhost:3001/api/courses/categories', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Cookie: cookieHeader,
      },
    })
    if (!response.ok) throw new Error('Failed to fetch categories')
    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getPlaylists() {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get('access_token')?.value
  const refreshToken = cookieStore.get('refresh_token')?.value

  const cookieHeader = [
    accessToken ? `access_token=${accessToken}` : '',
    refreshToken ? `refresh_token=${refreshToken}` : '',
  ]
    .filter(Boolean)
    .join('; ')

  try {
    const response = await fetch('http://localhost:3001/api/courses/playlists', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Cookie: cookieHeader,
      },
    })
    if (!response.ok) throw new Error('Failed to fetch playlists')
    return await response.json()
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return []
  }
}
