export type User = {
  name: string
  phone: string
  profileImage: string | null
}
// types/user.ts
export interface UserDTO {
  id: string
  name: string
  phone: string
  role: UserRole
  status: string
  profileImage: string | null
  createdAt: Date
  lastLogin: Date | null
  deletedAt: Date | null
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
