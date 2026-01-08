import type { User } from '../../domain/entities/user.entity'
import type { GetAllUsersResponseDTO } from '../dto/get-all-users-response.dto'

export function toUserDTO(user: User): GetAllUsersResponseDTO {
  return {
    uuid: user.uuid,
    name: user.name,
    phone: user.phone,
    role: user.role,
    status: user.status,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  }
}

export function toUserDTOs(users: User[]): GetAllUsersResponseDTO[] {
  return users.map(toUserDTO)
}
