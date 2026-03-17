'use client'

import { CourseManagementProps } from './types/course.management.type'

export async function CoursesManagement({ playlists }: CourseManagementProps) {
  return playlists.length > 0 ? (
    <div className='p-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {playlists.map(playlist => (
          <div key={playlist.id} className='bg-white rounded-lg shadow-md p-4'>
            <img
              src={playlist.playlistThumbnailUrl}
              alt={playlist.title}
              className='w-full h-48 object-cover rounded-md mb-4'
            />
            <h2 className='text-xl font-semibold mb-2'>{playlist.title}</h2>
            <p className='text-gray-600 mb-2'>{playlist.description}</p>
            <p className='text-gray-800 font-bold mb-2'>Narx: ${playlist.price}</p>
            <p className='text-sm text-gray-500 mb-2'>
              Yaratilgan: {new Date(playlist.createdAt).toLocaleDateString()}
            </p>
            <p className='text-sm text-gray-500 mb-4'>
              Kategoriya: {playlist.categories.map(cat => cat.name).join(', ')}
            </p>
            <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
              Tahrirlash
            </button>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='p-6'>
      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center'>
        <h2 className='text-xl font-bold text-yellow-800 mb-2'>Kurslar topilmadi</h2>
        <p className='text-yellow-600'>
          Hozircha hech qanday kurs mavjud emas. Yangi kurs qo'shish uchun "Yangi Kurs" tugmasini
          bosing.
        </p>
        <button className='mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>
          Yangi Kurs
        </button>
      </div>
    </div>
  )
}
