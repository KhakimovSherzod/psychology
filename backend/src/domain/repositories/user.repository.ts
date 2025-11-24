import { User } from '../entities/user.entity'

export interface IUserRepository {
  findByPhone(phone: string): Promise<User | null>
  create(user: User): Promise<User>
  findByUUID(uuid: string): Promise<User | null>
  updateUser(
    uuid: string,
    name?: string,
    phone?: string,
    pin?: string,
    profileImage?: string
  ): Promise<{ status: number; message: string }>

  deleteUser(uuid: string): Promise<{ status: string; message: string }>

  verifyPin(uuid: string, pin: string): Promise<boolean>
  changePin(uuid: string, newPin: string): Promise<{ status: number; message: string }>
  findByPhoneOrDeviceId(phone?: string, deviceId?: string): Promise<User | null>
  updateDeviceId(phone: string, deviceId: string): Promise<User | null>
  updateLastLogin(phone: string): Promise<void>
}
