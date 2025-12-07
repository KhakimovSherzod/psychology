import { Router } from 'express'
import { PinController } from '../controllers/pin.controller'

const router = Router()
const pinController = new PinController()

//* pin verification andupdating pin routes
router.post('/verify', (req, res) => pinController.verifyPin(req, res))
router.patch('/update', (req, res) => pinController.changePin(req, res))

export { router as protectedPinRoutes }
