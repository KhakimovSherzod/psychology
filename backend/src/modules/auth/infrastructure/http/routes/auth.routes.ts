import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'

const router = Router()
const authController = new AuthController()

//* authentication routes
router.post('/register', (req, res, next) => authController.register(req, res, next))
router.post('/login', (req, res, next) => authController.login(req, res, next))

export { router as publicAuthRoutes }
