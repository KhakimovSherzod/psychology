import { Router } from 'express'
import multer from 'multer'
import { VideoController } from '../controllers/video.controller'
const upload = multer()
const router = Router()
const videoController = new VideoController()

// get signed url from bunny server
router.get('/upload-url', (req, res) => videoController.generateSignedVideoUploadUrl(req, res))

// upload thumbnails to bunny server
router.post(
  '/upload-thumbnail',
  upload.single('thumbnail'),
  videoController.uploadVideoThumbnails.bind(videoController)
)

router.post('/', (req, res) => videoController.createVideo(req, res))
router.get('/', (req, res) => videoController.getAllVideos(req, res))

router.post('/sync-youtube-videos', (req, res) => videoController.syncYouTube(req, res))

export { router as videoRoutes }
