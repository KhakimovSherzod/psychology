import type { IUserRepository } from '@/modules/user/application/repositories/user.repository'

import type { PinHasher } from '../ports/pinHasher';
import { UserNotFound } from '@/shared/errors/repository/UserNotFound.error';
export class PinUserService {
  constructor(private userRepository: IUserRepository,private pinHasher:PinHasher) {}
  
  async verifyPin(deviceId: string, pin: string): Promise<boolean> {
    const user = await this.userRepository.findByPhoneOrDeviceId(deviceId)
    if(!user){
      throw new UserNotFound(`Foydalanuvchining qurilma id topilmadi`);
    }
    return await this.pinHasher.verify(pin,user.pinHashValue)
  }

async changePin(uuid: string, newPin: string) {

  const user = await this.userRepository.findByUUID(uuid)
  if (!user) {
    throw new UserNotFound(uuid)
  }

  const hashedNewPin = await this.pinHasher.hash(newPin)
  user.changePinHash(hashedNewPin)

  await this.userRepository.save(user)
}

}
