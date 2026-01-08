export type User = {
  name: string
  phone: string
  profileImage: string | null
}
// types/user.ts
export interface UserDTO {
  uuid: string
  name: string
  phone: string
  role: 'USER' | 'ADMIN' | 'OWNER'
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED' | 'DELETED'
  profileImage?: string
  createdAt: string
  lastLogin?: string
  // TODO: Implement later when backend is ready
  enrollments?: any[]
  payments?: any[]
}

export interface UpdateUserData {
  name?: string
  phone?: string
  pin?: string
  profileImage?: string
}