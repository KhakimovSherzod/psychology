'use client'

import { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Users, 
  BookOpen,
  FileText,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

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
  enrolledStudents: number
  thumbnail: string | null
  promoVideo: string | null
  lastUpdated: string
  modules: Module[]
}

interface CoursesManagementProps {
  initialCourses: Course[]
  categories: string[]
  stats: {
    totalCourses: number
    publishedCourses: number
    draftCourses: number
    totalStudents: number
    totalRevenue: number
  }
}

export default function CoursesManagement({ initialCourses, categories, stats }: CoursesManagementProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [courses, searchTerm, statusFilter, categoryFilter])

  // Toggle course status
  const toggleCourseStatus = async (courseId: string, currentStatus: 'draft' | 'published') => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/courses/${courseId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // })

      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, status: newStatus } : course
      ))
    } catch (error) {
      console.error('Error updating course status:', error)
      alert('Kurs holatini yangilashda xatolik yuz berdi')
    }
  }

  // Duplicate course
  const duplicateCourse = async (course: Course) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/admin/courses/${course.id}/duplicate`, {
      //   method: 'POST'
      // })
      // const newCourse = await response.json()

      const newCourse: Course = {
        ...course,
        id: Date.now().toString(),
        title: `${course.title} (Nusxa)`,
        enrolledStudents: 0,
        status: 'draft',
        lastUpdated: new Date().toISOString().split('T')[0]
      }

      setCourses([newCourse, ...courses])
      alert('Kurs muvaffaqiyatli nusxalandi')
    } catch (error) {
      console.error('Error duplicating course:', error)
      alert('Kursni nusxalashda xatolik yuz berdi')
    }
  }

  // Delete course
  const deleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`"${courseTitle}" kursini o'chirishni tasdiqlaysizmi?`)) return

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/courses/${courseId}`, {
      //   method: 'DELETE'
      // })

      setCourses(courses.filter(course => course.id !== courseId))
      alert('Kurs muvaffaqiyatli o‘chirildi')
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Kursni o‘chirishda xatolik yuz berdi')
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' so‘m'
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kurslar Boshqaruvi</h1>
          <p className="text-gray-600 mt-1">Barcha kurslarni boshqarish va tahrirlash</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Yangi Kurs
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Jami Kurslar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Nashr Etilgan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.publishedCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Qoralama</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draftCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">O'quvchilar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Jami Daromad</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Kurs nomi yoki tavsifi bo‘yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Barcha Holatlar</option>
              <option value="published">Nashr Etilgan</option>
              <option value="draft">Qoralama</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Barcha Kategoriyalar</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Narx
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategoriya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O'quvchilar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yangilangan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <BookOpen size={20} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{course.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {course.discountPrice ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">
                            {formatCurrency(course.price)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            {formatCurrency(course.discountPrice)}
                          </span>
                        </>
                      ) : (
                        formatCurrency(course.price)
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Users size={16} />
                      {course.enrolledStudents}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.status === 'published' ? 'Nashr Etilgan' : 'Qoralama'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(course.lastUpdated)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Tahrirlash"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => duplicateCourse(course)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Nusxalash"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => toggleCourseStatus(course.id, course.status)}
                        className={course.status === 'published' ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"}
                        title={course.status === 'published' ? 'Yashirish' : 'Nashr Qilish'}
                      >
                        {course.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id, course.title)}
                        className="text-red-600 hover:text-red-900"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Hech qanday kurs topilmadi
          </div>
        )}
      </div>
    </div>
  )
}