import { Device } from '@/modules/user/domain/entities/device.entity'
import { User } from '@/modules/user/domain/entities/user.entity'
import { PhoneNumber } from '@/modules/user/domain/value-objects/PhoneNumber'
import { UserName } from '@/modules/user/domain/value-objects/UserName'
import { UserAlreadyExist } from '@/shared/errors/application/UserAlreadyExist'

import type { IUserRepository } from '@/modules/user/application/repositories/user.repository'
import crypto from 'crypto'
import { RegisterUserResponseDTO, type RegisterUserDTO } from '../dto/register-user.dto'
import type { PinHasher } from '../ports/pinHasher'
import type { ITokenService } from '../ports/token.service'

export class RegisterUserService {
  constructor(
    private userRepository: IUserRepository,
    private pinHasher: PinHasher,
    private tokenService: ITokenService
  ) {}

  async execute(data: RegisterUserDTO) {
    // Check if user already exists
    const existing = await this.userRepository.findByPhone(data.phone)
    if (existing)
      throw new UserAlreadyExist(
        'Bu telefon foydalanuvchisi mavjud. Iltimos mavjud akkauntingizga kiring'
      )

    // Hash PIN
    const hashedPin = await this.pinHasher.hash(data.pin)

    // Create user aggregate
    const user = User.create(
      crypto.randomUUID(),
      new UserName(data.name),
      new PhoneNumber(data.phone),
      hashedPin
    )

    const device = Device.create(
      data.deviceId,
      user.id,
      data.deviceName,
      data.deviceType,
      data.os,
      data.browser,
      data.ipAddress,
      data.deviceToken
    )
    user.addDevice(device)

    // Persist user aggregate (with devices)
    const createdUser = RegisterUserResponseDTO.fromDomain(await this.userRepository.save(user))

    // Return JWT tokens
    return await this.tokenService.generateTokens({
      userId: createdUser.id,
      role: createdUser.role,
      deviceId: data.deviceId,
    })
  }
}
