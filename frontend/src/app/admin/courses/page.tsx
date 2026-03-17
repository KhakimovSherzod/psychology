// app/admin/courses/page.tsx (Server Component)

import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/auth'
import { CoursesManagement } from './CoursesManagement'

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export default async function AdminCoursesPage() {

  // Get cookies from the request
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!accessToken || !refreshToken) {
    return <div>Ruxsat yo&apos;q</div>
  }
  const currentUser = await getCurrentUser()
    if (currentUser?.role !== 'ADMIN') {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <h2 className='text-xl font-bold text-red-800 mb-2'>Ruxsat Yo&apos;q</h2>
          <p className='text-red-600'>Sizda admin paneliga kirish uchun ruxsat yo&apos;q.</p>
        </div>
      </div>
    )
  }
  
  // Fetch playlists from backend using SSR
  const playlists = await fetch(`${backendUrl}/api/playlist/admin/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${accessToken}; refreshToken=${refreshToken}` // server-to-server
    }
  }).then(res => {
    if (!res.ok) throw new Error('Failed to fetch playlists')
    return res.json()
  }).catch(err => {
    console.error(err)
    return []
  })


  return (
    <CoursesManagement playlists={playlists} />
  )
}