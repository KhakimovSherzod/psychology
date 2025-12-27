import { Router } from 'express'
import { PlaylistController } from '../controllers/playlist.controller'

const router = Router()
const playlistController = new PlaylistController()

// ---------------------- READ ----------------------
// Get all playlists
router.get('/', (req, res) => playlistController.getAllPlaylists(req, res))

// Get a single playlist by UUID
router.get('/:uuid', (req, res) => playlistController.getVideosInPlaylistByUuid(req, res))

// ---------------------- CREATE ----------------------
// Create a new playlist
router.post('/', (req, res) => playlistController.createPlaylist(req, res))

// ---------------------- UPDATE ----------------------
// Update a playlist by UUID
router.patch('/:uuid', (req, res) => playlistController.updatePlaylist(req, res))

// ---------------------- DELETE ----------------------
// Delete a playlist by UUID
router.delete('/:uuid', (req, res) => playlistController.deletePlaylist(req, res))

export { router as PlaylistRoutes }
