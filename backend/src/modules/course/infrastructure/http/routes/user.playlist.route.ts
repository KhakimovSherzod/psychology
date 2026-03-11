
import { Permission } from '@/shared/enums/UserPermission.enum'
import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'
import { PlaylistController } from '../controllers/playlist.controller'
import { createContainer } from '@/modules/course/container/course.container'

const router = Router()
const { playlistService } = createContainer();
const playlistController = new PlaylistController(playlistService)

// ---------------------- READ ----------------------
// Get all playlists for user
router.get('/', requirePermission(Permission.READ), (req, res, next) =>
  playlistController.getAllPlaylists(req, res, next)
)
// get single playlist for user
router.get('/:uuid', requirePermission(Permission.MANAGE),(req,res,next)=>
playlistController.getUserPlaylist(req,res,next))

// Get a single playlist videos by UUID
router.get('/:uuid/videos', requirePermission(Permission.READ), (req, res, next) =>
  playlistController.getVideosInPlaylist(req, res, next)
)


export { router as UserPlaylistRoutes }
