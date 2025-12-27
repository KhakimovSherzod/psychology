import { Router } from 'express'
import { UserController } from '../controllers/user.controller'

const router = Router()
const userController = new UserController()
// user routes
router.get('/me', (req, res) => userController.me(req, res))
router.patch('/update', (req, res) => userController.update(req, res))
router.delete('/delete', (req, res) => userController.delete(req, res))

router.get('/', (req, res, next) => userController.getAllUsers(req, res, next))
router.get('/:uuid', (req, res, next) => userController.getUserByUuid(req, res, next))
export { router as protectedUserRoutes }
