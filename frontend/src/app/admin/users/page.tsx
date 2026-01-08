// app/admin/users/page.tsx - UPDATED
import { getCurrentUser } from '@/lib/auth'
import { PlaylistDTO } from '@/types/playlist'
import { UserDTO } from '@/types/user'
import { cookies } from 'next/headers'
import UsersManagement from './UsersManagement'

// Remove mock data and use actual API calls
async function getUsersData(): Promise<UserDTO[]> {
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
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : data.users || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

async function getCoursesData(): Promise<PlaylistDTO[]> {
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/playlist/`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`)
    }

    const data: PlaylistDTO[] = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser()

  // Fetch real data
  const [users, courses] = await Promise.all([
    getUsersData(),
    getCoursesData(),
  ])

  // Check if user has admin permission
  if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'OWNER') {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <h2 className='text-xl font-bold text-red-800 mb-2'>Ruxsat Yo&apos;q</h2>
          <p className='text-red-600'>Sizda admin paneliga kirish uchun ruxsat yo&apos;q.</p>
        </div>
      </div>
    )
  }

  // TODO: Implement actual statistics when backend is ready
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.status === 'ACTIVE').length,
    blockedUsers: users.filter(
      user => user.status === 'BANNED' || user.status === 'SUSPENDED'
    ).length,
    // TODO: Implement total revenue when payment module is ready
    totalRevenue: 0,
  }

  return (
    <div className='p-6'>
      <UsersManagement 
        initialUsers={users} 
        courses={courses} 
        stats={stats} 
        currentUser={currentUser}
      />
    </div>
  )
}