import type { User } from '../../domain/entities/user.entity'
import type { GetAllUsersResponseDTO } from '../dto/get-all-users-response.dto'


export function toUserDTO(user: User): GetAllUsersResponseDTO {
  return {
    id: user.id,
    name: user.nameValue,
    phone: user.phoneValue,
    role: user.roleValue,
    status: user.statusValue,
    profileImage: user.profileImageValue,
    createdAt: user.createdAtValue,
    lastLogin: user.lastLoginValue,
    deletedAt: user.deletedAtValue,
  }
}

export function toUserDTOs(users: User[]): GetAllUsersResponseDTO[] {
  return users.map(toUserDTO)
}
