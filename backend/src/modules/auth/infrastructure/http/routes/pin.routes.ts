import { Permission } from '@/shared/enums/UserPermission.enum'
import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'
import { PinController } from '../controllers/pin.controller'

const router = Router()
const pinController = new PinController()

//* pin verification and updating pin routes
router.post('/verify', requirePermission(Permission.CHECK), (req, res) =>
  pinController.verifyPin(req, res)
)
router.patch('/update', requirePermission(Permission.WRITE), (req, res) =>
  pinController.changePin(req, res)
)
// router.post('/reset', (req, res) => pinController.resetPin(req, res))
export { router as protectedPinRoutes }
