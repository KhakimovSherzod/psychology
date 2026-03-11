
import { Permission } from '@/shared/enums/UserPermission.enum'
import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'
import multer from 'multer'
import { VideoController } from '../controllers/video.controller'
import { createContainer } from '@/modules/course/container/course.container'
const upload = multer()
const router = Router()
const { videoService, youTubeSyncService } = createContainer()
const videoController = new VideoController(videoService, youTubeSyncService)


//* ---------- ADMIN --------------


// upload thumbnails to bunny server
router.post(
  '/upload-thumbnail',
  requirePermission(Permission.CREATE),
  upload.single('thumbnail'),
  videoController.uploadVideoThumbnails.bind(videoController)
)

//sync youtube to update db, takes data from youtube and create new videos
router.post('/sync-youtube-videos', requirePermission(Permission.MANAGE), (req, res) =>
  videoController.syncYouTube(req, res)
)
// get signed url from bunny server to upload video
router.get('/upload-url', requirePermission(Permission.CREATE), (req, res, next) =>
  videoController.generateSignedVideoUploadUrl(req, res, next)
)

//* ---------  USERS and ADMIN -------------

//get all videos
router.get('/', requirePermission(Permission.MANAGE), (req, res, next) =>
  videoController.getAllAdminVideos(req, res, next)
)
router.get('/:uuid', requirePermission(Permission.MANAGE), (req, res, next) =>
  videoController.getAdminVideoByUUID(req, res, next)
)

router.get('/:uuid/play', requirePermission(Permission.MANAGE), (req, res, next) =>
  videoController.getVideoPlaybackUrl(req, res, next)
)




export { router as adminVideoRoutes }
