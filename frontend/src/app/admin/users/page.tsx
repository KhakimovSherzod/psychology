import { getCurrentUser } from '@/lib/auth'
import UsersManagement from './UsersManagement'

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: '1',
    name: 'Ali Valiyev',
    phone: '+998901234567',
    email: 'ali@example.com',
    status: 'active',
    role: 'student',
    enrolledCourses: ['Psixologiya Asoslari', 'Shaxsiy Rivojlanish'],
    totalPaid: 450000,
    registeredAt: '2024-01-15',
    lastLogin: '2024-03-20',
  },
  {
    id: '2',
    name: 'Zarina Xolmirzayeva',
    phone: '+998901234568',
    email: 'zarina@example.com',
    status: 'active',
    role: 'student',
    enrolledCourses: ['Psixologiya Asoslari'],
    totalPaid: 250000,
    registeredAt: '2024-02-10',
    lastLogin: '2024-03-19',
  },
  {
    id: '3',
    name: 'Shavkat Rahimov',
    phone: '+998901234569',
    email: 'shavkat@example.com',
    status: 'blocked',
    role: 'student',
    enrolledCourses: [],
    totalPaid: 0,
    registeredAt: '2024-03-01',
    lastLogin: '2024-03-05',
  },
  {
    id: '4',
    name: 'Dilnoza Karimova',
    phone: '+998901234570',
    email: 'dilnoza@example.com',
    status: 'active',
    role: 'teacher',
    enrolledCourses: [
      'Psixologiya Asoslari',
      'Shaxsiy Rivojlanish',
      'Murakkab Vaziyatlarda Qaror Qabul Qilish',
    ],
    totalPaid: 0,
    registeredAt: '2024-01-05',
    lastLogin: '2024-03-20',
  },
]

const mockCourses = [
  { id: '1', name: 'Psixologiya Asoslari', price: 250000 },
  { id: '2', name: 'Shaxsiy Rivojlanish', price: 200000 },
  { id: '3', name: 'Murakkab Vaziyatlarda Qaror Qabul Qilish', price: 300000 },
]

async function getUsersData() {
  // TODO: Replace with actual API call
  // const response = await fetch('http://localhost:3001/api/admin/users')
  // return response.json()

  return {
    users: mockUsers,
    courses: mockCourses,
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(user => user.status === 'active').length,
    blockedUsers: mockUsers.filter(user => user.status === 'blocked').length,
    totalRevenue: mockUsers.reduce((sum, user) => sum + user.totalPaid, 0),
  }
}

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser()
  console.log('Current user in AdminUsersPage:', currentUser)
  const usersData = await getUsersData()

  // Check if user is admin
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

  return (
    <div className='p-6'>
      <UsersManagement
        initialUsers={usersData.users}
        courses={usersData.courses}
        stats={{
          totalUsers: usersData.totalUsers,
          activeUsers: usersData.activeUsers,
          blockedUsers: usersData.blockedUsers,
          totalRevenue: usersData.totalRevenue,
        }}
      />
    </div>
  )
}
