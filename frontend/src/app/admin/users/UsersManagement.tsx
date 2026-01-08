// app/admin/users/UsersManagement.tsx - FINAL UPDATED
'use client'

import {
  AlertCircle,
  Ban,
  CheckCircle,
  Edit2,
  Eye,
  MoreVertical,
  PauseCircle,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

// Types
import { PlaylistDTO } from '@/types/playlist'
import { UpdateUserData, UserDTO } from '@/types/user'

interface UsersManagementProps {
  initialUsers: UserDTO[]
  courses: PlaylistDTO[]
  stats: {
    totalUsers: number
    activeUsers: number
    blockedUsers: number
    totalRevenue: number
  }
}

// Interface for the create/update form
interface UserFormData {
  name: string
  phone: string
  pin: string
  role: UserDTO['role']
  profileImage?: string
}

// API Service functions
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function fetchUsers(): Promise<UserDTO[]> {
  const response = await fetch(`${API_URL}/api/users`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.users || []
}

async function createUser(userData: {
  name: string
  phone: string
  pin: string
  role: UserDTO['role']
  profileImage?: string
}): Promise<UserDTO> {
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create user')
  }

  return response.json()
}

async function updateUserStatus(uuid: string, status: UserDTO['status']): Promise<void> {
  const response = await fetch(`${API_URL}/api/users/${uuid}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update status')
  }
}

async function reassignUserRole(uuid: string, role: UserDTO['role']): Promise<void> {
  const response = await fetch(`${API_URL}/api/users/${uuid}/role`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to reassign role')
  }
}

async function updateUser(uuid: string, updateData: UpdateUserData): Promise<UserDTO> {
  const response = await fetch(`${API_URL}/api/users/${uuid}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update user')
  }

  return response.json()
}

async function deleteUser(uuid: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/users/${uuid}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete user')
  }
}

// Status Menu Component
interface StatusMenuProps {
  user: UserDTO
  onUpdateStatus: (user: UserDTO, status: UserDTO['status']) => void
  loading: boolean
}

const StatusMenu: React.FC<StatusMenuProps> = ({ user, onUpdateStatus, loading }) => {
  const [isOpen, setIsOpen] = useState(false)

  const getAvailableStatuses = (user: UserDTO) => {
    const statuses: { value: UserDTO['status']; label: string; icon: React.ReactNode }[] = [
      { value: 'ACTIVE', label: 'Faollashtirish', icon: <CheckCircle size={16} /> },
      { value: 'INACTIVE', label: 'Nofaol qilish', icon: <XCircle size={16} /> },
      { value: 'SUSPENDED', label: 'Suspand qilish', icon: <Ban size={16} /> },
      { value: 'BANNED', label: 'Bloklash', icon: <Ban size={16} /> },
      { value: 'DELETED', label: "O'chirish", icon: <Trash2 size={16} /> },
    ]

    return statuses.filter(
      status =>
        status.value !== user.status && !(user.status === 'DELETED' && status.value === 'DELETED')
    )
  }

  const availableStatuses = getAvailableStatuses(user)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isOpen && !target.closest('.status-menu-container')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  return (
    <div className='status-menu-container relative inline-block'>
      <button
        onClick={e => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        disabled={availableStatuses.length === 0 || loading}
        className='p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        title="Holatni o'zgartirish"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && availableStatuses.length > 0 && (
        <div className='absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50'>
          <div className='py-1'>
            {availableStatuses.map(status => (
              <button
                key={status.value}
                onClick={e => {
                  e.stopPropagation()
                  onUpdateStatus(user, status.value)
                  setIsOpen(false)
                }}
                disabled={loading}
                className='flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors first:rounded-t-lg last:rounded-b-lg'
              >
                <span className='mr-2'>{status.icon}</span>
                <span>{status.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Mobile User Card Component
const MobileUserCard: React.FC<{
  user: UserDTO
  courses: PlaylistDTO[]
  onViewDetails: (user: UserDTO) => void
  onEditUser: (user: UserDTO) => void
  onUpdateStatus: (user: UserDTO, status: UserDTO['status']) => void
  onDeleteUser: (user: UserDTO) => void
  onReassignRole: (user: UserDTO) => void
  loading: boolean
}> = ({
  user,
  courses,
  onViewDetails,
  onEditUser,
  onUpdateStatus,
  onDeleteUser,
  onReassignRole,
  loading,
}) => {
  const statusInfo = getStatusInfo(user.status)
  const roleInfo = getRoleInfo(user.role)
  const StatusIcon = statusInfo.icon

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm border mb-3'>
      {/* User Header */}
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center flex-1 min-w-0'>
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className='h-12 w-12 rounded-full mr-3 flex-shrink-0'
            />
          ) : (
            <div className='h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0'>
              <span className='text-gray-600 font-semibold'>
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className='min-w-0 flex-1'>
            <h4 className='font-medium text-gray-900 truncate'>{user.name}</h4>
            <p className='text-sm text-gray-500 truncate'>{user.phone}</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className='flex items-center gap-1 ml-2 flex-shrink-0'>
          <button
            onClick={() => onViewDetails(user)}
            className='p-1 text-blue-600 hover:text-blue-900 rounded transition-colors'
            title="Batafsil ko'rish"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEditUser(user)}
            className='p-1 text-yellow-600 hover:text-yellow-900 rounded transition-colors'
            title='Tahrirlash'
          >
            <Edit2 size={16} />
          </button>
        </div>
      </div>

      {/* Status and Role */}
      <div className='flex flex-wrap gap-2 mb-3'>
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}
        >
          <StatusIcon size={12} className='mr-1' />
          {statusInfo.text}
        </span>
        <button
          onClick={() => onReassignRole(user)}
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${roleInfo.color}`}
        >
          {roleInfo.text}
        </button>
      </div>

      {/* Stats Row */}
      <div className='grid grid-cols-3 gap-2 mb-3 text-center'>
        <div className='bg-gray-50 p-2 rounded'>
          <div className='text-sm font-medium text-gray-900'>{user.enrollments?.length || 0}</div>
          <div className='text-xs text-gray-500'>Kurslar</div>
        </div>
        <div className='bg-gray-50 p-2 rounded'>
          <div className='text-sm font-medium text-gray-900'>{user.payments?.length || 0}</div>
          <div className='text-xs text-gray-500'>To'lovlar</div>
        </div>
        <div className='bg-gray-50 p-2 rounded'>
          <div className='text-sm font-medium text-gray-900'>
            {formatCurrency(
              user.payments?.reduce(
                (sum: number, payment: any) => sum + Number(payment.amount || 0),
                0
              ) || 0
            )}
          </div>
          <div className='text-xs text-gray-500'>Jami</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-between pt-3 border-t'>
        <div className='flex-1 pr-1'>
          <StatusMenu
            user={user}
            onUpdateStatus={onUpdateStatus}
            loading={loading}
          />
        </div>
        <button
          onClick={() => onReassignRole(user)}
          className='flex-1 px-2 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors'
        >
          Rol o'zgartirish
        </button>
        <button
          onClick={() => onDeleteUser(user)}
          disabled={loading || user.status === 'DELETED'}
          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ml-1 ${
            user.status === 'DELETED'
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-red-600 hover:text-red-800 hover:bg-red-50'
          }`}
        >
          O'chirish
        </button>
      </div>
    </div>
  )
}

// Helper functions moved outside component
const formatCurrency = (amount: number | undefined): string => {
  if (!amount) return '0 so‘m'
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so‘m'
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "Noma'lum"
  try {
    return new Date(dateString).toLocaleDateString('uz-UZ')
  } catch {
    return "Noma'lum"
  }
}

const getStatusInfo = (status: UserDTO['status']) => {
  switch (status) {
    case 'ACTIVE':
      return { text: 'Faol', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    case 'PENDING':
      return { text: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
    case 'INACTIVE':
      return { text: 'Nofaol', color: 'bg-gray-100 text-gray-800', icon: PauseCircle }
    case 'SUSPENDED':
      return { text: 'Suspand', color: 'bg-orange-100 text-orange-800', icon: Ban }
    case 'BANNED':
      return { text: 'Bloklangan', color: 'bg-red-100 text-red-800', icon: Ban }
    case 'DELETED':
      return { text: "O'chirilgan", color: 'bg-gray-300 text-gray-600', icon: Trash2 }
    default:
      return { text: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
  }
}

const getRoleInfo = (role: UserDTO['role']) => {
  switch (role) {
    case 'OWNER':
      return { text: 'Egasi', color: 'bg-purple-100 text-purple-800' }
    case 'ADMIN':
      return { text: 'Admin', color: 'bg-blue-100 text-blue-800' }
    case 'USER':
      return { text: 'Foydalanuvchi', color: 'bg-green-100 text-green-800' }
    default:
      return { text: role, color: 'bg-gray-100 text-gray-800' }
  }
}

export default function UsersManagement({ initialUsers, courses, stats }: UsersManagementProps) {
  const [users, setUsers] = useState<UserDTO[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | UserDTO['status']>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | UserDTO['role']>('all')
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    phone: '',
    pin: '',
    role: 'USER',
    profileImage: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.uuid.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter

      return matchesSearch && matchesStatus && matchesRole
    })
  }, [users, searchTerm, statusFilter, roleFilter])

  // Refresh users list
  const refreshUsers = async () => {
    setRefreshing(true)
    try {
      const freshUsers = await fetchUsers()
      setUsers(freshUsers)
      toast.success('Foydalanuvchilar yangilandi')
    } catch (error) {
      console.error('Error refreshing users:', error)
      toast.error('Foydalanuvchilarni yangilashda xatolik')
    } finally {
      setRefreshing(false)
    }
  }

  // Validate form data (mimics backend validation)
  const validateForm = (data: UserFormData, isNewUser: boolean): boolean => {
    const errors: Record<string, string> = {}

    // Name validation
    if (data.name && data.name.trim()) {
      if (data.name.length < 1) {
        errors.name = "Ism 1 ta xarfdan kam bo'lmasligi kerak"
      } else if (data.name.length > 50) {
        errors.name = "Ism 50 tadan ko'p bo'lmasligi kerak"
      }
    } else if (isNewUser) {
      errors.name = 'Ism talab qilinadi'
    }

    // Phone validation
    if (data.phone && data.phone.trim()) {
      const phoneRegex = /^[+]?[0-9]{10,15}$/
      if (!phoneRegex.test(data.phone)) {
        errors.phone = "Telefon raqam tog'ri formatda bolishi kerak"
      } else if (data.phone.length < 10) {
        errors.phone = "Telefon raqam 10 ta xarfdan kam bo'lmasligi kerak"
      } else if (data.phone.length > 15) {
        errors.phone = "Telefon raqam 15 tadan ko'p bo'lmasligi kerak"
      }
    } else if (isNewUser) {
      errors.phone = 'Telefon raqam talab qilinadi'
    }

    // PIN validation
    if (data.pin && data.pin.trim()) {
      const pinRegex = /^[0-9]{4}$/
      if (!pinRegex.test(data.pin)) {
        errors.pin = "PIN kodi 4 ta sondan iborat bo'lishi kerak"
      }
    } else if (isNewUser) {
      errors.pin = 'PIN kod talab qilinadi'
    }

    // Role validation
    if (!['USER', 'ADMIN'].includes(data.role)) {
      errors.role = "Rol 'USER' yoki 'ADMIN' bo'lishi kerak"
    }

    // Profile image validation (optional)
    if (data.profileImage && data.profileImage.trim()) {
      try {
        new URL(data.profileImage)
      } catch {
        errors.profileImage = "Profil rasmi to'g'ri URL formatda bo'lishi kerak"
      }
    }

    // For existing user updates, check if at least one field is provided
    if (!isNewUser && selectedUser) {
      const hasData = Object.entries(data).some(([key, value]) => {
        if (key === 'role') return false // Don't check role here, it's handled separately
        if (key === 'profileImage') return value && value.trim() !== ''
        return value && value.trim() !== '' && value !== selectedUser[key as keyof UserDTO]
      })
      if (!hasData) {
        errors.general = 'Kamida bitta maydonni yangilash kerak'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Update user status
  const handleUpdateStatus = async (user: UserDTO, newStatus: UserDTO['status']) => {
    try {
      setLoading(true)
      await updateUserStatus(user.uuid, newStatus)

      // Update local state
      setUsers(users.map(u => (u.uuid === user.uuid ? { ...u, status: newStatus } : u)))

      // Status display messages
      const statusMessages: Record<UserDTO['status'], string> = {
        ACTIVE: 'Foydalanuvchi faollashtirildi',
        INACTIVE: "Foydalanuvchi nofaol holatga o'tkazildi",
        SUSPENDED: "Foydalanuvchi suspand holatga o'tkazildi",
        BANNED: 'Foydalanuvchi bloklandi',
        DELETED: "Foydalanuvchi o'chirildi",
        PENDING: "Foydalanuvchi kutilmoqda holatga o'tkazildi",
      }

      toast.success(statusMessages[newStatus])
    } catch (error: any) {
      console.error('Error updating user status:', error)
      toast.error(error.message || 'Holatni yangilashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  // Reassign user role
  const handleReassignRole = async (user: UserDTO, newRole: UserDTO['role']) => {
    try {
      setLoading(true)
      await reassignUserRole(user.uuid, newRole)

      // Update local state
      setUsers(users.map(u => (u.uuid === user.uuid ? { ...u, role: newRole } : u)))

      toast.success('Foydalanuvchi roli muvaffaqiyatli o\'zgartirildi')
      setShowRoleModal(false)
    } catch (error: any) {
      console.error('Error reassigning user role:', error)
      toast.error(error.message || 'Rolni o\'zgartirishda xatolik')
    } finally {
      setLoading(false)
    }
  }

  // Delete user
  const handleDeleteUser = async (user: UserDTO) => {
    // Prevent deleting already deleted users
    if (user.status === 'DELETED') {
      toast.error("Bu foydalanuvchi allaqachon o'chirilgan")
      return
    }

    if (
      !confirm(
        `"${user.name}" foydalanuvchisini o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.`
      )
    )
      return

    try {
      setLoading(true)
      await deleteUser(user.uuid)

      // Update status to DELETED instead of removing from array
      setUsers(users.map(u => (u.uuid === user.uuid ? { ...u, status: 'DELETED' } : u)))

      toast.success("Foydalanuvchi o'chirildi")
    } catch (error: any) {
      console.error('Error deleting user:', error)
      toast.error(error.message || "O'chirishda xatolik")
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Create new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    const isNewUser = !selectedUser

    if (!validateForm(formData, isNewUser)) {
      return
    }

    try {
      setLoading(true)

      if (isNewUser) {
        // Create new user
        const userData = {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          pin: formData.pin,
          role: formData.role,
        }

        const newUser = await createUser(userData)

        // Add new user to the list
        setUsers(prev => [newUser, ...prev])
        toast.success('Yangi foydalanuvchi muvaffaqiyatli yaratildi')
      } else {
        // Update existing user
        const updateData: UpdateUserData = {}
        if (formData.name.trim() !== selectedUser.name) updateData.name = formData.name.trim()
        if (formData.phone.trim() !== selectedUser.phone) updateData.phone = formData.phone.trim()
        if (formData.pin && formData.pin.trim()) updateData.pin = formData.pin.trim()
        if (formData.profileImage?.trim() !== selectedUser.profileImage) {
          updateData.profileImage = formData.profileImage?.trim()
        }

        const updatedUser = await updateUser(selectedUser.uuid, updateData)
        setUsers(users.map(u => (u.uuid === selectedUser.uuid ? { ...u, ...updatedUser } : u)))
        toast.success("Foydalanuvchi ma'lumotlari yangilandi")
      }

      // Reset form and close modal
      setShowEditUser(false)
      setFormData({
        name: '',
        phone: '',
        pin: '',
        role: 'USER',
        profileImage: '',
      })
      setFormErrors({})
      setSelectedUser(null)
    } catch (error: any) {
      console.error('Error creating/updating user:', error)
      toast.error(error.message || 'Operatsiyada xatolik')
    } finally {
      setLoading(false)
    }
  }

  // Open edit modal with user data
  const openEditModal = (user: UserDTO) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      phone: user.phone,
      pin: '', // Don't show existing PIN for security
      role: user.role,
      profileImage: user.profileImage || '',
    })
    setFormErrors({})
    setShowEditUser(true)
  }

  // Open create new user modal
  const openCreateModal = () => {
    setSelectedUser(null)
    setFormData({
      name: '',
      phone: '',
      pin: '',
      role: 'USER',
      profileImage: '',
    })
    setFormErrors({})
    setShowEditUser(true)
  }

  // Close edit modal
  const closeEditModal = () => {
    setShowEditUser(false)
    setSelectedUser(null)
    setFormData({
      name: '',
      phone: '',
      pin: '',
      role: 'USER',
      profileImage: '',
    })
    setFormErrors({})
  }

  return (
    <div className='space-y-4 md:space-y-6 px-2 md:px-0'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-3'>
        <div>
          <h1 className='text-xl md:text-3xl font-bold text-gray-900'>Foydalanuvchilar Boshqaruvi</h1>
          <p className='text-xs md:text-sm text-gray-600 mt-1'>
            Barcha foydalanuvchilarni boshqarish va monitoring qilish
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={refreshUsers}
            disabled={refreshing}
            className='flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex-1 md:flex-none justify-center'
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span className='hidden md:inline'>Yangilash</span>
          </button>
          <button
            onClick={openCreateModal}
            className='flex items-center gap-2 bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base flex-1 md:flex-none justify-center'
          >
            <UserPlus size={16} />
            <span className='hidden md:inline'>Yangi Foydalanuvchi</span>
            <span className='md:hidden'>Yangi</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
        <div className='bg-white p-3 md:p-4 rounded-lg shadow-sm border'>
          <div className='flex items-center gap-2 md:gap-3'>
            <div className='p-1 md:p-2 bg-blue-100 rounded-lg'>
              <Users className='text-blue-600' size={20} />
            </div>
            <div>
              <p className='text-xs md:text-sm text-gray-600'>Jami Foydalanuvchilar</p>
              <p className='text-lg md:text-2xl font-bold text-gray-900'>{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className='bg-white p-3 md:p-4 rounded-lg shadow-sm border'>
          <div className='flex items-center gap-2 md:gap-3'>
            <div className='p-1 md:p-2 bg-green-100 rounded-lg'>
              <UserCheck className='text-green-600' size={20} />
            </div>
            <div>
              <p className='text-xs md:text-sm text-gray-600'>Faol Foydalanuvchilar</p>
              <p className='text-lg md:text-2xl font-bold text-gray-900'>{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className='bg-white p-3 md:p-4 rounded-lg shadow-sm border'>
          <div className='flex items-center gap-2 md:gap-3'>
            <div className='p-1 md:p-2 bg-red-100 rounded-lg'>
              <UserX className='text-red-600' size={20} />
            </div>
            <div>
              <p className='text-xs md:text-sm text-gray-600'>Bloklanganlar</p>
              <p className='text-lg md:text-2xl font-bold text-gray-900'>{stats.blockedUsers}</p>
            </div>
          </div>
        </div>

        <div className='bg-white p-3 md:p-4 rounded-lg shadow-sm border'>
          <div className='flex items-center gap-2 md:gap-3'>
            <div className='p-1 md:p-2 bg-purple-100 rounded-lg'>
              <TrendingUp className='text-purple-600' size={20} />
            </div>
            <div>
              <p className='text-xs md:text-sm text-gray-600'>Jami Daromad</p>
              <p className='text-lg md:text-2xl font-bold text-gray-900'>
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='bg-white p-3 md:p-4 rounded-lg shadow-sm border'>
        <div className='flex flex-col gap-3'>
          {/* Search */}
          <div className='flex-1'>
            <div className='relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={16}
              />
              <input
                type='text'
                placeholder='Ism, telefon yoki UUID bo‘yicha qidirish...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base'
              />
            </div>
          </div>

          {/* Filters */}
          <div className='flex gap-2'>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className='flex-1 px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
            >
              <option value='all'>Barcha Holat</option>
              <option value='ACTIVE'>Faol</option>
              <option value='PENDING'>Kutilmoqda</option>
              <option value='INACTIVE'>Nofaol</option>
              <option value='SUSPENDED'>Suspand</option>
              <option value='BANNED'>Bloklangan</option>
              <option value='DELETED'>O'chirilgan</option>
            </select>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as any)}
              className='flex-1 px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
            >
              <option value='all'>Barcha Rollar</option>
              <option value='USER'>Foydalanuvchi</option>
              <option value='ADMIN'>Admin</option>
              <option value='OWNER'>Egasi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List - Mobile Card View */}
      {isMobileView ? (
        <div className='space-y-2'>
          {filteredUsers.map(user => (
            <MobileUserCard
              key={user.uuid}
              user={user}
              courses={courses}
              onViewDetails={(user) => {
                setSelectedUser(user)
                setShowUserDetails(true)
              }}
              onEditUser={openEditModal}
              onUpdateStatus={handleUpdateStatus}
              onDeleteUser={handleDeleteUser}
              onReassignRole={(user) => {
                setSelectedUser(user)
                setShowRoleModal(true)
              }}
              loading={loading}
            />
          ))}
          
          {filteredUsers.length === 0 && (
            <div className='text-center py-8 text-gray-500 bg-white rounded-lg border'>
              Hech qanday foydalanuvchi topilmadi
            </div>
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Foydalanuvchi
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Ro'l
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Holat
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Kurslar
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    To'lovlar
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Ro'yxatdan o'tgan
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredUsers.map(user => {
                  const statusInfo = getStatusInfo(user.status)
                  const roleInfo = getRoleInfo(user.role)
                  const StatusIcon = statusInfo.icon

                  return (
                    <tr key={user.uuid} className='hover:bg-gray-50'>
                      <td className='px-4 md:px-6 py-4'>
                        <div className='flex items-center'>
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className='h-8 w-8 md:h-10 md:w-10 rounded-full mr-2 md:mr-3'
                            />
                          ) : (
                            <div className='h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-200 flex items-center justify-center mr-2 md:mr-3'>
                              <span className='text-gray-600 font-semibold text-sm'>
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className='text-sm font-medium text-gray-900'>{user.name}</div>
                            <div className='text-xs text-gray-500'>{user.phone}</div>
                            <div className='text-xs text-gray-400 truncate max-w-[100px] md:max-w-none'>
                              UUID: {user.uuid.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 md:px-6 py-4'>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowRoleModal(true)
                          }}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${roleInfo.color}`}
                        >
                          {roleInfo.text}
                        </button>
                      </td>
                      <td className='px-4 md:px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}
                          >
                            <StatusIcon size={12} className='mr-1' />
                            {statusInfo.text}
                          </span>
                        </div>
                      </td>
                      <td className='px-4 md:px-6 py-4'>
                        <div className='text-sm text-gray-900'>
                          {user.enrollments?.length || 0} ta kurs
                        </div>
                        {user.enrollments && user.enrollments.length > 0 && (
                          <div className='text-xs text-gray-500 mt-1 truncate max-w-[150px]'>
                            {user.enrollments
                              .slice(0, 2)
                              .map((enrollment: any) => {
                                const course = courses.find(c => c.uuid === enrollment.playlistId)
                                return course?.title
                              })
                              .filter(Boolean)
                              .join(', ')}
                            {user.enrollments.length > 2 &&
                              ` va ${user.enrollments.length - 2} ta boshqa`}
                          </div>
                        )}
                      </td>
                      <td className='px-4 md:px-6 py-4'>
                        <div className='text-sm text-gray-900'>
                          {user.payments?.length || 0} ta to'lov
                        </div>
                        <div className='text-sm font-medium text-gray-700'>
                          {formatCurrency(
                            user.payments?.reduce(
                              (sum: number, payment: any) => sum + Number(payment.amount || 0),
                              0
                            ) || 0
                          )}
                        </div>
                      </td>
                      <td className='px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatDate(user.createdAt)}
                      </td>
                      <td className='px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex items-center gap-1'>
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUserDetails(true)
                            }}
                            className='p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors'
                            title="Batafsil ko'rish"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => openEditModal(user)}
                            className='p-1 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded transition-colors'
                            title='Tahrirlash'
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Status Menu Component */}
                          <StatusMenu
                            user={user}
                            onUpdateStatus={handleUpdateStatus}
                            loading={loading}
                          />

                          <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={loading || user.status === 'DELETED'}
                            className={`p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              user.status === 'DELETED'
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                            }`}
                            title={user.status === 'DELETED' ? "O'chirilgan" : "O'chirish"}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className='text-center py-8 text-gray-500'>Hech qanday foydalanuvchi topilmadi</div>
          )}
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50'>
          <div className='bg-white rounded-lg w-full max-w-md md:max-w-3xl max-h-[90vh] overflow-y-auto'>
            <div className='p-4 md:p-6'>
              <div className='flex justify-between items-center mb-4 md:mb-6'>
                <h3 className='text-lg md:text-xl font-bold'>Foydalanuvchi Ma&apos;lumotlari</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className='text-gray-400 hover:text-gray-600 text-2xl transition-colors'
                >
                  ×
                </button>
              </div>

              <div className='space-y-4 md:space-y-6'>
                {/* User Info */}
                <div className='flex items-start gap-3 md:gap-4'>
                  {selectedUser.profileImage ? (
                    <img
                      src={selectedUser.profileImage}
                      alt={selectedUser.name}
                      className='h-16 w-16 md:h-20 md:w-20 rounded-full'
                    />
                  ) : (
                    <div className='h-16 w-16 md:h-20 md:w-20 rounded-full bg-gray-200 flex items-center justify-center'>
                      <span className='text-xl md:text-2xl text-gray-600 font-semibold'>
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className='flex-1'>
                    <h4 className='text-base md:text-lg font-semibold'>{selectedUser.name}</h4>
                    <p className='text-xs md:text-sm text-gray-600'>UUID: {selectedUser.uuid}</p>
                    <div className='flex flex-wrap gap-1 md:gap-2 mt-2'>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          getStatusInfo(selectedUser.status).color
                        }`}
                      >
                        {getStatusInfo(selectedUser.status).text}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          getRoleInfo(selectedUser.role).color
                        }`}
                      >
                        {getRoleInfo(selectedUser.role).text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Info Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
                  <div>
                    <h4 className='font-semibold mb-2 text-gray-700 text-sm md:text-base'>Kontakt Ma&apos;lumotlari</h4>
                    <div className='space-y-1 md:space-y-2'>
                      <div>
                        <span className='text-gray-600 text-xs md:text-sm'>Telefon:</span>
                        <p className='font-medium text-sm md:text-base'>{selectedUser.phone}</p>
                      </div>
                      <div>
                        <span className='text-gray-600 text-xs md:text-sm'>Ro&apos;yxatdan o&apos;tgan:</span>
                        <p className='font-medium text-sm md:text-base'>{formatDate(selectedUser.createdAt)}</p>
                      </div>
                      <div>
                        <span className='text-gray-600 text-xs md:text-sm'>Oxirgi kirish:</span>
                        <p className='font-medium text-sm md:text-base'>{formatDate(selectedUser.lastLogin)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className='font-semibold mb-2 text-gray-700 text-sm md:text-base'>Statistika</h4>
                    <div className='space-y-1 md:space-y-2'>
                      <div>
                        <span className='text-gray-600 text-xs md:text-sm'>Kurslar soni:</span>
                        <p className='font-medium text-sm md:text-base'>{selectedUser.enrollments?.length || 0} ta</p>
                      </div>
                      <div>
                        <span className='text-gray-600 text-xs md:text-sm'>To&apos;lovlar soni:</span>
                        <p className='font-medium text-sm md:text-base'>{selectedUser.payments?.length || 0} ta</p>
                      </div>
                      <div>
                        <span className='text-gray-600 text-xs md:text-sm'>Jami sarflangan summa:</span>
                        <p className='font-medium text-sm md:text-base'>
                          {formatCurrency(
                            selectedUser.payments?.reduce(
                              (sum: number, payment: any) => sum + Number(payment.amount || 0),
                              0
                            ) || 0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrolled Courses */}
                {selectedUser.enrollments && selectedUser.enrollments.length > 0 ? (
                  <div>
                    <h4 className='font-semibold mb-2 md:mb-3 text-gray-700 text-sm md:text-base'>
                      Yozilgan Kurslar ({selectedUser.enrollments.length})
                    </h4>
                    <div className='space-y-2 max-h-40 md:max-h-60 overflow-y-auto'>
                      {selectedUser.enrollments.map((enrollment: any, index: number) => {
                        const course = courses.find(c => c.uuid === enrollment.playlistId)
                        return (
                          <div
                            key={index}
                            className='flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded-lg'
                          >
                            <div className='flex-1 min-w-0'>
                              <span className='font-medium text-sm md:text-base truncate block'>
                                {course?.title || 'Noma&apos;lum kurs'}
                              </span>
                              <p className='text-xs text-gray-600 mt-1'>
                                Yozilgan: {formatDate(enrollment.createdAt)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-3 md:py-4 text-gray-500 text-sm md:text-base'>
                    Foydalanuvchi hali hech qanday kursga yozilmagan
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Reassign Modal */}
      {showRoleModal && selectedUser && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50'>
          <div className='bg-white rounded-lg w-full max-w-md'>
            <div className='p-4 md:p-6'>
              <h3 className='text-lg font-bold mb-3 md:mb-4'>Foydalanuvchi Rolini O&apos;zgartirish</h3>
              <p className='text-sm md:text-base text-gray-600 mb-4 md:mb-6'>
                <span className='font-medium'>{selectedUser.name}</span> foydalanuvchisining roli
              </p>

              <div className='space-y-2 md:space-y-3 mb-4 md:mb-6'>
                {(['USER', 'ADMIN', 'OWNER'] as const).map(role => (
                  <label
                    key={role}
                    className='flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
                  >
                    <input
                      type='radio'
                      name='role'
                      value={role}
                      checked={selectedUser.role === role}
                      onChange={() => setSelectedUser({ ...selectedUser, role })}
                      className='mr-3'
                    />
                    <span className='flex-1 text-sm md:text-base'>{getRoleInfo(role).text}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleInfo(role).color}`}>
                      {role}
                    </span>
                  </label>
                ))}
              </div>

              <div className='flex justify-end gap-2'>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className='px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base'
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => handleReassignRole(selectedUser, selectedUser.role)}
                  disabled={loading}
                  className='px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base'
                >
                  {loading ? 'Yangilanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create User Modal */}
      {showEditUser && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50'>
          <div className='bg-white rounded-lg w-full max-w-md'>
            <div className='p-4 md:p-6'>
              <h3 className='text-lg font-bold mb-3 md:mb-4'>
                {selectedUser ? 'Foydalanuvchini Tahrirlash' : 'Yangi Foydalanuvchi'}
              </h3>

              {formErrors.general && (
                <div className='mb-3 md:mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-sm text-red-800'>{formErrors.general}</p>
                </div>
              )}

              <form onSubmit={handleCreateUser}>
                <div className='space-y-3 md:space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Ism</label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleFormChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base'
                      placeholder='Ism kiriting'
                      required={!selectedUser}
                    />
                    {formErrors.name && (
                      <p className='mt-1 text-sm text-red-600'>{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Telefon</label>
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleFormChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base'
                      placeholder='+998901234567'
                      required={!selectedUser}
                    />
                    {formErrors.phone && (
                      <p className='mt-1 text-sm text-red-600'>{formErrors.phone}</p>
                    )}
                  </div>

                  {!selectedUser && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        PIN (4 ta raqam)
                      </label>
                      <input
                        type='password'
                        name='pin'
                        value={formData.pin}
                        onChange={handleFormChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base'
                        placeholder='1234'
                        maxLength={4}
                        required
                      />
                      {formErrors.pin && (
                        <p className='mt-1 text-sm text-red-600'>{formErrors.pin}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Rol</label>
                    <select
                      name='role'
                      value={formData.role}
                      onChange={handleFormChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base'
                      required={!selectedUser}
                    >
                      <option value='USER'>Foydalanuvchi</option>
                      <option value='ADMIN'>Admin</option>
                    </select>
                    {formErrors.role && (
                      <p className='mt-1 text-sm text-red-600'>{formErrors.role}</p>
                    )}
                  </div>
                </div>

                <div className='flex justify-end gap-2 mt-4 md:mt-6'>
                  <button
                    type='button'
                    onClick={closeEditModal}
                    className='px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base'
                  >
                    Bekor qilish
                  </button>
                  <button
                    type='submit'
                    disabled={loading}
                    className='px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base'
                  >
                    {loading ? 'Saqlanmoqda...' : selectedUser ? 'Yangilash' : 'Yaratish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}