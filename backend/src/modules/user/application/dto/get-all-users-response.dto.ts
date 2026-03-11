import type { UserRole } from '@/shared/enums/UserRole.enum'

export interface GetAllUsersResponseDTO {
  id: string
  name: string
  phone: string
  role: UserRole
  status: string
  profileImage: string | null
  createdAt: Date
  lastLogin: Date | null
  deletedAt: Date | null
}
