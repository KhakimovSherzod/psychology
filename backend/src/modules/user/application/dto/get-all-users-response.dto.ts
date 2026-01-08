import type { UserRole } from '@/shared/enums/UserRole.enum'

export interface GetAllUsersResponseDTO {
  uuid: string
  name: string
  phone: string
  role: UserRole
  status: string
  profileImage: string | undefined
  createdAt: Date
  lastLogin: Date | undefined
}
