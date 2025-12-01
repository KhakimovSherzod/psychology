import { getCurrentUser } from '@/lib/auth'
import CourseEditor from './CourseEditor'

// Mock data - replace with actual API call
async function getCourseData(id: string) {
  // TODO: Replace with actual API call
  // const response = await fetch(`http://localhost:3001/api/admin/courses/${id}`)
  // return response.json()

  return {
    id: id,
    title: 'Psixologiya Asoslari',
    description: 'Psixologiyaning asosiy tushunchalari va metodlarini o‘rganing',
    price: 250000,
    discountPrice: 200000,
    category: 'Psixologiya',
    status: 'published',
    thumbnail: '/images/psychology-basics.jpg',
    promoVideo: 'https://youtube.com/embed/example1',
    modules: [
      {
        id: 'm1',
        title: 'Kirish',
        lessons: [
          { 
            id: 'l1', 
            title: 'Psixologiya nima?', 
            type: 'video', 
            duration: '15:00',
            content: 'video-url-1'
          },
          { 
            id: 'l2', 
            title: 'Psixologiya tarixi', 
            type: 'text', 
            duration: '10:00',
            content: 'Psixologiya tarixi...'
          }
        ]
      },
      {
        id: 'm2',
        title: 'Asosiy Tushunchalar',
        lessons: [
          { 
            id: 'l3', 
            title: 'Shaxs psixologiyasi', 
            type: 'video', 
            duration: '20:00',
            content: 'video-url-2'
          }
        ]
      }
    ]
  }
}

const mockCategories = [
  'Psixologiya',
  'Shaxsiy Rivojlanish',
  'Biznes',
  'Ta\'lim',
  'Sog‘liq',
  'Texnologiya'
]

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser()
  const courseData = await getCourseData(params.id)
  const categories = mockCategories

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Ruxsat Yo'q</h2>
          <p className="text-red-600">Sizda admin paneliga kirish uchun ruxsat yo'q.</p>
        </div>
      </div>
    )
  }

  return <CourseEditor course={courseData} categories={categories} />
}