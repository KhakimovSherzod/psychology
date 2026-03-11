import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { createAuthContainer } from '@/modules/auth/container/createAuthContainer';

const router = Router()
  const {loginService,registerService} = createAuthContainer();
const authController = new AuthController(loginService, registerService)

//* authentication routes
router.post('/register', (req, res, next) => authController.register(req, res, next))
router.post('/login', (req, res, next) => authController.login(req, res, next))

export { router as publicAuthRoutes }
