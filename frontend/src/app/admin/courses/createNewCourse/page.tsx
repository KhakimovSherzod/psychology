import { getCategories, getPlaylists } from '@/lib/course-actions'
import CreateCourseForm from './CreateCourseForm'

export default async function CreateNewCoursePage() {
  const [categories, playlists] = await Promise.all([
    getCategories(),
    getPlaylists()
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Yangi Kurs Yaratish
              </h1>
              <p className="text-lg text-gray-600">
                Kurs ma'lumotlarini to'ldiring va videoni yuklang
              </p>
            </div>
            
            <CreateCourseForm 
              categories={categories} 
              playlists={playlists} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}