import { User } from '../entities/user.entity'

export interface IUserRepository {
  findByPhone(phone: string): Promise<User | null>
  create(user: User): Promise<User>
}
