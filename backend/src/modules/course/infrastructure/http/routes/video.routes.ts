import { Router } from 'express'
import { VideoController } from '../controllers/video.controller'

const router = Router()
const videoController = new VideoController()
router.get('/upload-url', (req, res) => videoController.generateSignedVideoUploadUrl(req, res))
export { router as videoRoutes }
