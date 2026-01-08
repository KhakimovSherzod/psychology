import { getCurrentUser } from '@/lib/auth'
import axios from 'axios'
import CoursesManagement from './CoursesManagement'
import { headers } from 'next/headers'

//env variables
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
console.log('Backend URL:', backendUrl)

// Mock data - replace with actual API calls
const mockCourses = [
  {
    id: '1',
    title: 'Psixologiya Asoslari',
    description: 'Psixologiyaning asosiy tushunchalari va metodlarini o‘rganing',
    price: 250000,
    discountPrice: 200000,
    category: 'Psixologiya',
    status: 'published',
    enrolledStudents: 45,
    thumbnail: '/images/psychology-basics.jpg',
    promoVideo: 'https://youtube.com/embed/example1',
    lastUpdated: '2024-03-15',
    modules: [
      {
        id: 'm1',
        title: 'Kirish',
        lessons: [
          { id: 'l1', title: 'Psixologiya nima?', type: 'video', duration: '15:00' },
          { id: 'l2', title: 'Psixologiya tarixi', type: 'text', duration: '10:00' },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Shaxsiy Rivojlanish',
    description: 'Shaxsiy o‘sish va rivojlanish usullari',
    price: 300000,
    discountPrice: null,
    category: 'Shaxsiy Rivojlanish',
    status: 'published',
    enrolledStudents: 32,
    thumbnail: '/images/personal-growth.jpg',
    promoVideo: null,
    lastUpdated: '2024-03-10',
    modules: [],
  },
  {
    id: '3',
    title: 'Murakkab Vaziyatlarda Qaror Qabul Qilish',
    description: 'Qiyin vaziyatlarda to‘g‘ri qaror qabul qilish texnikalari',
    price: 400000,
    discountPrice: 350000,
    category: 'Biznes',
    status: 'draft',
    enrolledStudents: 0,
    thumbnail: null,
    promoVideo: null,
    lastUpdated: '2024-03-18',
    modules: [],
  },
]

const mockCategories = [
  'Psixologiya',
  'Shaxsiy Rivojlanish',
  'Biznes',
  "Ta'lim",
  'Sog‘liq',
  'Texnologiya',
]

async function getCoursesData() {
  // TODO: Replace with actual API call
  return {
    courses: mockCourses,
    categories: mockCategories,
    totalCourses: mockCourses.length,
    publishedCourses: mockCourses.filter(course => course.status === 'published').length,
    draftCourses: mockCourses.filter(course => course.status === 'draft').length,
    totalStudents: mockCourses.reduce((sum, course) => sum + course.enrolledStudents, 0),
    totalRevenue: mockCourses.reduce((sum, course) => {
      const price = course.discountPrice || course.price
      return sum + price * course.enrolledStudents
    }, 0),
  }
}
async function getplaylists() {
  const cookies = (await headers()).get('cookie') || ''
  const playlists = await axios.get(`${backendUrl}/api/playlist/`, {
    headers: {
      Cookie: cookies,
    },
    withCredentials: true,
  })

  return playlists.data
}

export default async function AdminCoursesPage() {
  const currentUser = await getCurrentUser()
  const coursesData = await getCoursesData()
  const playlists = await getplaylists()

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <h2 className='text-xl font-bold text-red-800 mb-2'>Ruxsat Yo'q</h2>
          <p className='text-red-600'>Sizda admin paneliga kirish uchun ruxsat yo'q.</p>
        </div>
      </div>
    )
  }

  return (
    <CoursesManagement
      playlists={playlists}
      initialCourses={coursesData.courses}
      categories={coursesData.categories}
      stats={{
        totalCourses: coursesData.totalCourses,
        publishedCourses: coursesData.publishedCourses,
        draftCourses: coursesData.draftCourses,
        totalStudents: coursesData.totalStudents,
        totalRevenue: coursesData.totalRevenue,
      }}
    />
  )
}
