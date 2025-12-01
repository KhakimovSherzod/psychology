'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Eye, Lock, Unlock, Key, UserPlus, DollarSign, Users, UserCheck, UserX, TrendingUp } from 'lucide-react'

interface User {
  id: string
  name: string
  phone: string
  email: string
  status: 'active' | 'blocked'
  role: 'student' | 'teacher' | 'admin'
  enrolledCourses: string[]
  totalPaid: number
  registeredAt: string
  lastLogin: string
}

interface Course {
  id: string
  name: string
  price: number
}

interface UsersManagementProps {
  initialUsers: User[]
  courses: Course[]
  stats: {
    totalUsers: number
    activeUsers: number
    blockedUsers: number
    totalRevenue: number
  }
}

export default function UsersManagement({ initialUsers, courses, stats }: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher' | 'admin'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [users, searchTerm, statusFilter, roleFilter])

  // Toggle user block status
  const toggleUserStatus = async (userId: string, currentStatus: 'active' | 'blocked') => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
    
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/users/${userId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // })

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ))
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Foydalanuvchi holatini yangilashda xatolik yuz berdi')
    }
  }

  // Reset user password
  const resetPassword = async (userId: string) => {
    if (!confirm('Foydalanuvchi parolini qayta tiklamoqchimisiz?')) return

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/users/${userId}/reset-password`, {
      //   method: 'POST'
      // })
      
      alert('Parol muvaffaqiyatli qayta tiklandi. Yangi parol foydalanuvchiga SMS orqali yuborildi.')
    } catch (error) {
      console.error('Error resetting password:', error)
      alert('Parolni qayta tiklashda xatolik yuz berdi')
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
          <h1 className="text-3xl font-bold text-gray-900">Foydalanuvchilar Boshqaruvi</h1>
          <p className="text-gray-600 mt-1">Barcha foydalanuvchilarni boshqarish va monitoring qilish</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={20} />
          Yangi Foydalanuvchi
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Jami Foydalanuvchilar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Faol Foydalanuvchilar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bloklanganlar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.blockedUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
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
                placeholder="Foydalanuvchi ismi, telefon yoki email bo‘yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Barcha Holatlar</option>
              <option value="active">Faol</option>
              <option value="blocked">Bloklangan</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Barcha Rollar</option>
              <option value="student">O‘quvchi</option>
              <option value="teacher">O‘qituvchi</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ro‘l
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurslar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To‘langan Summa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'O‘qituvchi' : 'O‘quvchi'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.enrolledCourses.length} ta kurs
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.enrolledCourses.slice(0, 2).join(', ')}
                      {user.enrolledCourses.length > 2 && ` va ${user.enrolledCourses.length - 2} ta boshqa`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(user.totalPaid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Faol' : 'Bloklangan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserDetails(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Kurslarni ko‘rish"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id, user.status)}
                        className={user.status === 'active' ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                        title={user.status === 'active' ? 'Bloklash' : 'Blokdan chiqarish'}
                      >
                        {user.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                      <button
                        onClick={() => resetPassword(user.id)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Parolni qayta tiklash"
                      >
                        <Key size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          // Show payment details modal
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="To‘lov ma'lumotlari"
                      >
                        <DollarSign size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Hech qanday foydalanuvchi topilmadi
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Foydalanuvchi Ma'lumotlari</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Asosiy Ma'lumotlar</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ism:</span>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Telefon:</span>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ro‘l:</span>
                      <p className="font-medium">
                        {selectedUser.role === 'admin' ? 'Admin' : 
                         selectedUser.role === 'teacher' ? 'O‘qituvchi' : 'O‘quvchi'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ro‘yxatdan o‘tgan sana:</span>
                      <p className="font-medium">{formatDate(selectedUser.registeredAt)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Oxirgi kirish:</span>
                      <p className="font-medium">{formatDate(selectedUser.lastLogin)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Kurslar ({selectedUser.enrolledCourses.length})</h4>
                  <div className="space-y-2">
                    {selectedUser.enrolledCourses.map((course, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{course}</span>
                        <span className="text-sm text-gray-600">
                          {courses.find(c => c.name === course)?.price ? 
                           formatCurrency(courses.find(c => c.name === course)!.price) : 'Noma\'lum'}
                        </span>
                      </div>
                    ))}
                    {selectedUser.enrolledCourses.length === 0 && (
                      <p className="text-gray-500 text-sm">Hech qanday kursga yozilmagan</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">To‘lov Ma'lumotlari</h4>
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="text-sm">
                      <span className="font-medium">Jami to‘langan summa: </span>
                      {formatCurrency(selectedUser.totalPaid)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}