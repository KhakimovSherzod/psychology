import { createContainer } from '@/modules/course/container/course.container'
import { Permission } from '@/shared/enums/UserPermission.enum'
import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'
import { PlaylistController } from '../controllers/playlist.controller'

const router = Router()
const { playlistService } = createContainer()
const playlistController = new PlaylistController(playlistService)

// ---------------------- READ ----------------------

// Get all playlists for admin
router.get('/', requirePermission(Permission.MANAGE), (req, res, next) =>
  playlistController.getAllPlaylistsForAdmin(req, res, next)
)

// get single playlist
router.get('/:uuid', requirePermission(Permission.MANAGE), (req, res, next) =>
  playlistController.getAdminPlaylist(req, res, next)
)

// Get a single playlist videos by UUID
router.get('/:uuid/videos', requirePermission(Permission.READ), (req, res, next) =>
  playlistController.getVideosInPlaylistForAdmin(req, res, next)
)

//post data to db
router.post('/:uuid/video', requirePermission(Permission.CREATE), (req, res, next) =>
  playlistController.createVideo(req, res, next)
)

// ---------------------- Create ----------------------------

// Create a new playlist only admin and higher access required
router.post('/', requirePermission(Permission.CREATE), (req, res, next) =>
  playlistController.createPlaylist(req, res, next)
)

// ---------------------- UPDATE ----------------------
// Update a playlist by UUID
router.patch('/:uuid', requirePermission(Permission.UPDATE), (req, res, next) =>
  playlistController.updatePlaylist(req, res, next)
)

// ---------------------- DELETE ----------------------
// Delete a playlist by UUID
router.delete('/:uuid', requirePermission(Permission.DELETE), (req, res, next) =>
  playlistController.deletePlaylist(req, res, next)
)

export { router as AdminPlaylistRoutes }
