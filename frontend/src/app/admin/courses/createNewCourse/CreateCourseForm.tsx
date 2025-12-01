'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

interface Category {
  id: string
  name: string
  description: string
}

interface Playlist {
  id: string
  title: string
  description: string
  playlistThumbnailUrl: string
}

interface CreateCourseFormProps {
  categories: Category[]
  playlists: Playlist[]
}

interface UploadProgress {
  thumbnail: number
  video: number
}

export default function CreateCourseForm({ categories, playlists }: CreateCourseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [courseId, setCourseId] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    thumbnail: 0,
    video: 0,
  })
  const [uploadStatus, setUploadStatus] = useState({
    thumbnail: 'waiting',
    video: 'waiting',
  })

  const thumbnailFileRef = useRef<HTMLInputElement>(null)
  const videoFileRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subtitles: '',
    videoUrl: '',
    thumbnailUrl: '',
    categoryId: '',
    level: 'BEGINNER',
    price: 0,
    status: 'DRAFT',
    playlistId: '',
    order: 0,
    publishedAt: '',
  })

  // New playlist state
  const [showNewPlaylist, setShowNewPlaylist] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    description: '',
    playlistThumbnailUrl: '',
  })

  // New category state
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  })

  const handleInputChange = useCallback((field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    setError('')
    setSuccess('')
  }, [])

  const handleNewPlaylistChange = useCallback((field: string, value: string) => {
    setNewPlaylist(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleNewCategoryChange = useCallback((field: string, value: string) => {
    setNewCategory(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setError('Kategoriya nomini kiriting')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/courses/categories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newCategory),
      })

      if (response.ok) {
        setSuccess('Yangi kategoriya muvaffaqiyatli yaratildi')
        setNewCategory({ name: '', description: '' })
        setShowNewCategory(false)
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.message || 'Kategoriya yaratishda xatolik')
      }
    } catch (err) {
      setError('Server bilan ulanishda xatolik')
    } finally {
      setLoading(false)
    }
  }

  // File upload handler with progress
  const uploadFile = async (file: File, type: 'thumbnail' | 'video', courseId: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('courseId', courseId)
    formData.append('type', type)

    try {
      setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }))

      const xhr = new XMLHttpRequest()

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', event => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            setUploadProgress(prev => ({ ...prev, [type]: progress }))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            setUploadStatus(prev => ({ ...prev, [type]: 'completed' }))
            resolve(xhr.response)
          } else {
            setUploadStatus(prev => ({ ...prev, [type]: 'error' }))
            reject(new Error('Upload failed'))
          }
        })

        xhr.addEventListener('error', () => {
          setUploadStatus(prev => ({ ...prev, [type]: 'error' }))
          reject(new Error('Upload failed'))
        })

        // xhr.open('POST', `http://localhost:3001/api/courses/upload-${type}`)
        // xhr.withCredentials = true
        // xhr.send(formData)

        console.log('Simulating upload for', type)
        console.log('formdata', formData)
      })
    } catch (err) {
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }))
      throw err
    }
  }

  // Handle file uploads after course creation
  const handleFileUploads = async (courseId: string) => {
    const thumbnailFile = thumbnailFileRef.current?.files?.[0]
    const videoFile = videoFileRef.current?.files?.[0]

    if (!thumbnailFile && !videoFile) {
      setSuccess('Kurs yaratildi! Fayllar yuklanmadi.')
      return
    }

    try {
      const uploadPromises = []

      if (thumbnailFile) {
        uploadPromises.push(uploadFile(thumbnailFile, 'thumbnail', courseId))
      }

      if (videoFile) {
        uploadPromises.push(uploadFile(videoFile, 'video', courseId))
      }

      await Promise.all(uploadPromises)
      setSuccess('Kurs va barcha fayllar muvaffaqiyatli yuklandi!')

      setTimeout(() => {
        router.push('/dashboard/courses')
      }, 2000)
    } catch (err) {
      setError('Fayllarni yuklashda xatolik. Kurs yaratildi, lekin fayllar yuklanmadi.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    setUploadProgress({ thumbnail: 0, video: 0 })
    setUploadStatus({ thumbnail: 'waiting', video: 'waiting' })

    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Majburiy maydonlarni to'ldiring (nomi, tavsif)")
      setLoading(false)
      return
    }

    if (!formData.categoryId) {
      setError('Kategoriyani tanlang')
      setLoading(false)
      return
    }

    try {
      const requestData: any = {
        ...formData,
        price: Number(formData.price),
        order: Number(formData.order),
        // Clear URLs since we'll upload files separately
        videoUrl: '',
        thumbnailUrl: '',
      }

      // Add new playlist data if creating new playlist
      if (showNewPlaylist && newPlaylist.title.trim()) {
        requestData.newPlaylist = newPlaylist
      }

      const response = await fetch('http://localhost:3001/api/courses/createNewCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const data = await response.json()
        const newCourseId = data.courseId || data.id

        if (newCourseId) {
          setCourseId(newCourseId)
          setSuccess('Kurs yaratildi! Endi fayllarni yuklang.')

          // Start file uploads
          await handleFileUploads(newCourseId)
        } else {
          setError('Kurs yaratildi, lekin ID olinmadi')
        }
      } else {
        const data = await response.json()
        setError(data.message || 'Kurs yaratishda xatolik')
      }
    } catch (err) {
      setError('Server bilan ulanishda xatolik')
    } finally {
      setLoading(false)
    }
  }

  // Render upload section after course creation
  const renderUploadSection = () => {
    if (!courseId) return null

    return (
      <div className='bg-blue-50 rounded-xl p-6 border border-blue-200'>
        <h2 className='text-xl font-semibold text-blue-800 mb-4'>Fayllarni Yuklash</h2>
        <p className='text-blue-700 mb-6'>Kurs yaratildi! Endi video va rasm fayllarini yuklang.</p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Thumbnail Upload */}
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Kurs Rasmi</label>
              <input
                ref={thumbnailFileRef}
                type='file'
                accept='image/*'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              />
            </div>

            {/* Thumbnail Progress */}
            {uploadStatus.thumbnail !== 'waiting' && (
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Yuklanmoqda...</span>
                  <span className='text-gray-600'>{Math.round(uploadProgress.thumbnail)}%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      uploadStatus.thumbnail === 'completed'
                        ? 'bg-green-500'
                        : uploadStatus.thumbnail === 'error'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${uploadProgress.thumbnail}%` }}
                  />
                </div>
                <div className='text-xs text-gray-500'>
                  {uploadStatus.thumbnail === 'completed' && '✅ Yuklandi'}
                  {uploadStatus.thumbnail === 'error' && '❌ Xatolik'}
                  {uploadStatus.thumbnail === 'uploading' && 'Yuklanmoqda...'}
                </div>
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Video Fayl</label>
              <input
                ref={videoFileRef}
                type='file'
                accept='video/*'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              />
            </div>

            {/* Video Progress */}
            {uploadStatus.video !== 'waiting' && (
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Yuklanmoqda...</span>
                  <span className='text-gray-600'>{Math.round(uploadProgress.video)}%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      uploadStatus.video === 'completed'
                        ? 'bg-green-500'
                        : uploadStatus.video === 'error'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${uploadProgress.video}%` }}
                  />
                </div>
                <div className='text-xs text-gray-500'>
                  {uploadStatus.video === 'completed' && '✅ Yuklandi'}
                  {uploadStatus.video === 'error' && '❌ Xatolik'}
                  {uploadStatus.video === 'uploading' && 'Yuklanmoqda...'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Status Summary */}
        {(uploadStatus.thumbnail !== 'waiting' || uploadStatus.video !== 'waiting') && (
          <div className='mt-6 p-4 bg-white rounded-lg border'>
            <h3 className='font-medium text-gray-800 mb-2'>Yuklash Holati:</h3>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span>Rasm:</span>
                <span
                  className={`
                  ${uploadStatus.thumbnail === 'completed' ? 'text-green-600' : ''}
                  ${uploadStatus.thumbnail === 'error' ? 'text-red-600' : ''}
                  ${uploadStatus.thumbnail === 'uploading' ? 'text-blue-600' : ''}
                `}
                >
                  {uploadStatus.thumbnail === 'completed' && '✅ Yuklandi'}
                  {uploadStatus.thumbnail === 'error' && '❌ Xatolik'}
                  {uploadStatus.thumbnail === 'uploading' && '🔄 Yuklanmoqda'}
                  {uploadStatus.thumbnail === 'waiting' && '⏳ Kutmoqda'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Video:</span>
                <span
                  className={`
                  ${uploadStatus.video === 'completed' ? 'text-green-600' : ''}
                  ${uploadStatus.video === 'error' ? 'text-red-600' : ''}
                  ${uploadStatus.video === 'uploading' ? 'text-blue-600' : ''}
                `}
                >
                  {uploadStatus.video === 'completed' && '✅ Yuklandi'}
                  {uploadStatus.video === 'error' && '❌ Xatolik'}
                  {uploadStatus.video === 'uploading' && '🔄 Yuklanmoqda'}
                  {uploadStatus.video === 'waiting' && '⏳ Kutmoqda'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {/* Error and Success Messages */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-700 text-sm'>{error}</p>
        </div>
      )}

      {success && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <p className='text-green-700 text-sm'>{success}</p>
        </div>
      )}

      {/* Basic Information Section */}
      <div className='bg-gray-50 rounded-xl p-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Asosiy Ma'lumotlar</h2>

        <div className='grid grid-cols-1 gap-6'>
          {/* Course Title */}
          <div>
            <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>
              Kurs Nomi *
            </label>
            <input
              id='title'
              type='text'
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              placeholder='Kurs nomini kiriting...'
              required
            />
          </div>

          {/* Course Description */}
          <div>
            <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-2'>
              Kurs Tavsifi *
            </label>
            <textarea
              id='description'
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              rows={4}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              placeholder="Kurs haqida batafsil ma'lumot..."
              required
            />
          </div>

          {/* Subtitles */}
          <div>
            <label htmlFor='subtitles' className='block text-sm font-medium text-gray-700 mb-2'>
              Subtitrlar
            </label>
            <textarea
              id='subtitles'
              value={formData.subtitles}
              onChange={e => handleInputChange('subtitles', e.target.value)}
              rows={2}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              placeholder="Subtitrlar (agar mavjud bo'lsa)..."
            />
          </div>
        </div>
      </div>

      {/* File Upload Section - Shown after course creation */}
      {renderUploadSection()}

      {/* Category and Playlist Section */}
      <div className='bg-gray-50 rounded-xl p-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Kategoriya va Pleylist</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Category Selection */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <label htmlFor='categoryId' className='block text-sm font-medium text-gray-700'>
                Kategoriya *
              </label>
              <button
                type='button'
                onClick={() => setShowNewCategory(!showNewCategory)}
                className='text-sm text-blue-600 hover:text-blue-700 font-medium'
              >
                {showNewCategory ? 'Bekor qilish' : '+ Yangi Kategoriya'}
              </button>
            </div>

            {!showNewCategory ? (
              <select
                id='categoryId'
                value={formData.categoryId}
                onChange={e => handleInputChange('categoryId', e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                required
              >
                <option value=''>Kategoriyani tanlang</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className='space-y-3 p-4 bg-white border border-gray-200 rounded-lg'>
                <input
                  type='text'
                  value={newCategory.name}
                  onChange={e => handleNewCategoryChange('name', e.target.value)}
                  placeholder='Yangi kategoriya nomi'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
                <input
                  type='text'
                  value={newCategory.description}
                  onChange={e => handleNewCategoryChange('description', e.target.value)}
                  placeholder='Kategoriya tavsifi'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={handleCreateCategory}
                    disabled={loading}
                    className='flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50'
                  >
                    {loading ? 'Yaratilmoqda...' : 'Yaratish'}
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowNewCategory(false)}
                    className='flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600'
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Playlist Selection */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <label htmlFor='playlistId' className='block text-sm font-medium text-gray-700'>
                Pleylist
              </label>
              <button
                type='button'
                onClick={() => setShowNewPlaylist(!showNewPlaylist)}
                className='text-sm text-blue-600 hover:text-blue-700 font-medium'
              >
                {showNewPlaylist ? 'Bekor qilish' : '+ Yangi Pleylist'}
              </button>
            </div>

            {!showNewPlaylist ? (
              <select
                id='playlistId'
                value={formData.playlistId}
                onChange={e => handleInputChange('playlistId', e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              >
                <option value=''>Pleylistsiz (yakka video)</option>
                {playlists.map(playlist => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.title}
                  </option>
                ))}
              </select>
            ) : (
              <div className='space-y-3 p-4 bg-white border border-gray-200 rounded-lg'>
                <input
                  type='text'
                  value={newPlaylist.title}
                  onChange={e => handleNewPlaylistChange('title', e.target.value)}
                  placeholder='Yangi pleylist nomi'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
                <input
                  type='text'
                  value={newPlaylist.description}
                  onChange={e => handleNewPlaylistChange('description', e.target.value)}
                  placeholder='Pleylist tavsifi'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
                <input
                  type='url'
                  value={newPlaylist.playlistThumbnailUrl}
                  onChange={e => handleNewPlaylistChange('playlistThumbnailUrl', e.target.value)}
                  placeholder='Pleylist rasmi URL'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className='bg-gray-50 rounded-xl p-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Qo'shimcha Sozlamalar</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Level */}
          <div>
            <label htmlFor='level' className='block text-sm font-medium text-gray-700 mb-2'>
              Daraja
            </label>
            <select
              id='level'
              value={formData.level}
              onChange={e => handleInputChange('level', e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            >
              <option value='BEGINNER'>Boshlang'ich</option>
              <option value='INTERMEDIATE'>O'rta</option>
              <option value='ADVANCED'>Yuqori</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-2'>
              Narx (so'm)
            </label>
            <input
              id='price'
              type='number'
              value={formData.price}
              onChange={e => handleInputChange('price', e.target.value)}
              min='0'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            />
          </div>

          {/* Order */}
          <div>
            <label htmlFor='order' className='block text-sm font-medium text-gray-700 mb-2'>
              Tartib
            </label>
            <input
              id='order'
              type='number'
              value={formData.order}
              onChange={e => handleInputChange('order', e.target.value)}
              min='0'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-2'>
              Holat
            </label>
            <select
              id='status'
              value={formData.status}
              onChange={e => handleInputChange('status', e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            >
              <option value='DRAFT'>Qoralama</option>
              <option value='PUBLISHED'>Nashr qilingan</option>
              <option value='ARCHIVED'>Arxivlangan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200'>
        <button
          type='button'
          onClick={() => router.back()}
          className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200'
        >
          Ortga qaytish
        </button>
        <button
          type='submit'
          disabled={loading}
          className='px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[120px]'
        >
          {loading ? (
            <>
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
              Yaratilmoqda...
            </>
          ) : (
            'Kurs Yaratish'
          )}
        </button>
      </div>
    </form>
  )
}
