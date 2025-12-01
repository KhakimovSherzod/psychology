'use client'

import { useState } from 'react'
import { 
  Save, 
  Plus, 
  Trash2, 
  Video, 
  FileText, 
  HelpCircle,
  Upload,
  Link as LinkIcon
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'file'
  duration: string
  content?: string
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string
  price: number
  discountPrice: number | null
  category: string
  status: 'draft' | 'published'
  thumbnail: string | null
  promoVideo: string | null
  modules: Module[]
}

interface CourseEditorProps {
  course: Course
  categories: string[]
}

export default function CourseEditor({ course, categories }: CourseEditorProps) {
  const [formData, setFormData] = useState<Course>(course)
  const [saving, setSaving] = useState(false)

  // Update basic course info
  const updateCourseField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Add new module
  const addModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: 'Yangi Modul',
      lessons: []
    }
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }))
  }

  // Update module title
  const updateModuleTitle = (moduleId: string, title: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId ? { ...module, title } : module
      )
    }))
  }

  // Delete module
  const deleteModule = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== moduleId)
    }))
  }

  // Add lesson to module
  const addLesson = (moduleId: string, type: Lesson['type']) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: 'Yangi Dars',
      type,
      duration: '00:00'
    }

    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? { ...module, lessons: [...module.lessons, newLesson] }
          : module
      )
    }))
  }

  // Update lesson
  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, ...updates } : lesson
              )
            }
          : module
      )
    }))
  }

  // Delete lesson
  const deleteLesson = (moduleId: string, lessonId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
          : module
      )
    }))
  }

  // Handle file upload
  const handleFileUpload = async (file: File, type: 'thumbnail' | 'video') => {
    // TODO: Implement file upload logic
    console.log('Uploading file:', file, type)
  }

  // Save course
  const saveCourse = async () => {
    setSaving(true)
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/courses/${formData.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      alert('Kurs muvaffaqiyatli saqlandi')
    } catch (error) {
      console.error('Error saving course:', error)
      alert('Kursni saqlashda xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kurs Tahrirlash</h1>
          <p className="text-gray-600 mt-1">Kurs ma'lumotlarini tahrirlang</p>
        </div>
        <button
          onClick={saveCourse}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Course Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Asosiy Ma'lumotlar</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kurs Nomi *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateCourseField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kurs nomini kiriting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tavsif *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateCourseField('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kurs tavsifini kiriting"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategoriya *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateCourseField('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Holat
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateCourseField('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Qoralama</option>
                    <option value="published">Nashr Etilgan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Narx</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asosiy Narx *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateCourseField('price', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="250000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chegirmali Narx
                </label>
                <input
                  type="number"
                  value={formData.discountPrice || ''}
                  onChange={(e) => updateCourseField('discountPrice', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="200000"
                />
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Kurs Dasturi</h2>
              <button
                onClick={addModule}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
              >
                <Plus size={16} />
                Modul Qo'shish
              </button>
            </div>

            <div className="space-y-4">
              {formData.modules.map((module, moduleIndex) => (
                <div key={module.id} className="border rounded-lg">
                  <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                      className="flex-1 bg-transparent border-none text-lg font-semibold focus:ring-0 p-0"
                    />
                    <button
                      onClick={() => deleteModule(module.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="p-4">
                    {/* Lesson Actions */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => addLesson(module.id, 'video')}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                      >
                        <Video size={14} />
                        Video
                      </button>
                      <button
                        onClick={() => addLesson(module.id, 'text')}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                      >
                        <FileText size={14} />
                        Matn
                      </button>
                      <button
                        onClick={() => addLesson(module.id, 'quiz')}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
                      >
                        <HelpCircle size={14} />
                        Test
                      </button>
                      <button
                        onClick={() => addLesson(module.id, 'file')}
                        className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200"
                      >
                        <Upload size={14} />
                        Fayl
                      </button>
                    </div>

                    {/* Lessons List */}
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center gap-3 p-3 border rounded">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                              className="w-full bg-transparent border-none focus:ring-0 p-0"
                              placeholder="Dars nomi"
                            />
                          </div>
                          <input
                            type="text"
                            value={lesson.duration}
                            onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="00:00"
                          />
                          <button
                            onClick={() => deleteLesson(module.id, lesson.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Thumbnail Upload */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">Kurs Rasmi</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-600 mb-2">Rasm yuklash</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'thumbnail')}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-blue-700"
              >
                Rasm Tanlash
              </label>
            </div>
          </div>

          {/* Promo Video */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">Promo Video</h3>
            <div className="space-y-3">
              <input
                type="url"
                value={formData.promoVideo || ''}
                onChange={(e) => updateCourseField('promoVideo', e.target.value)}
                placeholder="YouTube video linki"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Video className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-600 mb-2">Yoki video yuklash</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-green-700"
                >
                  Video Yuklash
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}