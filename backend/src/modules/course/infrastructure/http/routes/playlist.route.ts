import { Permission } from '@/shared/enums/UserPermission.enum'
import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'
import { PlaylistController } from '../controllers/playlist.controller'

const router = Router()
const playlistController = new PlaylistController()

// ---------------------- READ ----------------------
// Get all playlists
router.get('/', requirePermission(Permission.READ), (req, res) =>
  playlistController.getAllPlaylists(req, res)
)

// Get a single playlist by UUID
router.get('/:uuid', requirePermission(Permission.READ), (req, res) =>
  playlistController.getVideosInPlaylistByUuid(req, res)
)

// ---------------------- CREATE ----------------------
// Create a new playlist
router.post('/', requirePermission(Permission.CREATE), (req, res) =>
  playlistController.createPlaylist(req, res)
)

// ---------------------- UPDATE ----------------------
// Update a playlist by UUID
router.patch('/:uuid', requirePermission(Permission.UPDATE), (req, res) =>
  playlistController.updatePlaylist(req, res)
)

// ---------------------- DELETE ----------------------
// Delete a playlist by UUID
router.delete('/:uuid', requirePermission(Permission.DELETE), (req, res) =>
  playlistController.deletePlaylist(req, res)
)

export { router as PlaylistRoutes }
