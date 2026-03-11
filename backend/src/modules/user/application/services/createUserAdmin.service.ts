import { v4 as uuidv4 } from 'uuid'
import { PhoneNumber } from '../../domain/value-objects/PhoneNumber'
import { UserName } from '../../domain/value-objects/UserName'
import type { GetAllUsersResponseDTO } from '../dto/get-all-users-response.dto'
import type { IUserRepository } from '../repositories/user.repository'
import type { PinHasher } from './../../../auth/application/ports/pinHasher'

import { User } from '../../domain/entities/user.entity'
import { toUserDTO } from '../mappers/user.mapper'

export class CreateUserByAdminService {
  constructor(private userRepository: IUserRepository, private pinHasher: PinHasher) {}
  async createUser(name: string, phone: string, pin: string): Promise<GetAllUsersResponseDTO> {
    // Create value objects
    const nameValue = new UserName(name)
    const phoneValue = new PhoneNumber(phone)

    // Hash PIN
    const pinHash = await this.pinHasher.hash(pin)

    // Generate UUID
    const uuid = uuidv4()

    // Create user entity
    const newUser = User.create(uuid, nameValue, phoneValue, pinHash)

    const user = await this.userRepository.create(newUser)

    return toUserDTO(user)
  }
}
