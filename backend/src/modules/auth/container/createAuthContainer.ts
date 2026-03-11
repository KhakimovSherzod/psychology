import { UserService } from '@/modules/user/application/services/user.service'
import { PrismaUserRepository } from '@/modules/user/infrastructure/prisma/repositories/user.prisma.repository'
import { AuthMiddleware } from '@/shared/middlewares/auth.middleware'
import { LoginUserService } from '../application/service/login-user.service'
import { RegisterUserService } from '../application/service/register-user.service'
import { BcryptPinHasher } from '../infrastructure/services/BcryptPinHasher'
import { JwtTokenService } from '../infrastructure/services/jwt.token.service'
import { PinUserService } from '../application/service/pin-user.service'

export function createAuthContainer() {
  const userRepo = new PrismaUserRepository()
  const pinHasher = new BcryptPinHasher()
  const tokenService = new JwtTokenService()
  const userRepository = new PrismaUserRepository()
  const userService = new UserService(userRepository)
  const authMiddleware = new AuthMiddleware(tokenService, userService)
  const registerService = new RegisterUserService(userRepo, pinHasher, tokenService)
  const loginService = new LoginUserService(userRepo, pinHasher, tokenService)
  const pinUserService = new PinUserService(userRepo, pinHasher)
  return {
    loginService,
    registerService,
    authMiddleware,
    pinUserService
  }
}
