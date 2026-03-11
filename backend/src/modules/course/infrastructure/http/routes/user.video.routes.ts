
import { Permission } from '@/shared/enums/UserPermission.enum'
import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'

import { VideoController } from '../controllers/video.controller'
import { createContainer } from '@/modules/course/container/course.container'

const router = Router()
const { videoService, youTubeSyncService } = createContainer()
const videoController = new VideoController(videoService, youTubeSyncService)

//* ---------  USERS -------------

//get all videos
router.get('/', requirePermission(Permission.READ), (req, res, next) =>
  videoController.getAllUserVideos(req, res, next)
)
router.get('/:uuid', requirePermission(Permission.READ), (req, res, next) =>
  videoController.getUserVideoByUUID(req, res, next)
)

router.get('/:uuid/play', requirePermission(Permission.READ), (req, res, next) =>
  videoController.getVideoPlaybackUrl(req, res, next)
)



export { router as userVideoRoutes }
