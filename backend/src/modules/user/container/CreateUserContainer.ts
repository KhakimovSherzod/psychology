
import { CreateUserByAdminService } from "../application/services/createUserAdmin.service"
import { UpdateUserService } from "../application/services/updateUser.service"
import { UserService } from "../application/services/user.service"
import { PrismaUserRepository } from "../infrastructure/prisma/repositories/user.prisma.repository"
import { BcryptPinHasher } from '@/modules/auth/infrastructure/services/BcryptPinHasher';

export function createUserContainer(){
    const userRepo = new PrismaUserRepository()

    const updateUserService = new UpdateUserService(userRepo)

    const userService = new UserService(userRepo)
    const pinHasher = new BcryptPinHasher()
    const createUserByAdminService = new CreateUserByAdminService(userRepo, pinHasher)
  return {
    userService,
    createUserByAdminService,
    updateUserService
  }
}