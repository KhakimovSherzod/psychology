import { Router } from 'express'
import { VideoController } from '../controllers/video.controller'
import multer from 'multer'
const upload = multer()
const router = Router()
const videoController = new VideoController()
router.get('/upload-url', (req, res) => videoController.generateSignedVideoUploadUrl(req, res))
router.post('/upload-thumbnail',
  upload.single('thumbnail'),
  videoController.uploadVideoThumbnails.bind(videoController)
);

export { router as videoRoutes }
