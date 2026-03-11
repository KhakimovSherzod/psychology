
import { Permission } from '@/shared/enums/UserPermission.enum'
import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'
import { PinController } from '../controllers/pin.controller'
import { createAuthContainer } from '@/modules/auth/container/createAuthContainer';

const router = Router()
const {pinUserService} = createAuthContainer();
const pinController = new PinController(pinUserService)

//* pin verification and updating pin routes
router.post('/verify', requirePermission(Permission.CHECK), (req, res,next) =>
  pinController.verifyPin(req, res, next)
)
router.patch('/update', requirePermission(Permission.WRITE), (req, res,next) =>
  pinController.changePin(req, res,next)
)
// router.post('/reset', (req, res) => pinController.resetPin(req, res))
export { router as protectedPinRoutes }
