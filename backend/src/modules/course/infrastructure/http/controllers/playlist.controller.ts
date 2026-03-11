import { PlaylistService } from '@/modules/course/application/service/playlist.service'
import { uuidParamSchema } from '@/shared/validator/uuid.validator'
import type { PlaylistStatus, Visibility } from '@prisma/client'
import type { Request, Response } from 'express'
import type { NextFunction } from 'express-serve-static-core'
import { createVideoSchema } from '../../validator/create.video.validator'
import { createPlaylistSchema } from '../../validator/createPlaylistSchema'
import { updatePlaylistSchema } from '../../validator/update.playlist.validator'

export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  // -------------------- READ --------------------
  // get all playlist for users
  async getAllPlaylists(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlists = await this.playlistService.getAllPlaylists(req.user.sub)

      res.status(200).json(playlists)
    } catch (err) {
      next(err)
    }
  }
  
    //get videos for user
  async getVideosInPlaylist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userUUID = uuidParamSchema.parse(req.user.sub)
      const playlistUUID = uuidParamSchema.parse(req.params.uuid)

      const videosInPlaylist = await this.playlistService.getVideosByPlaylistUuidForUser(userUUID, playlistUUID)

      res.status(200).json(videosInPlaylist)
    } catch (err) {
      next(err)
    }
  }

  // get all playlist for admin
  async getAllPlaylistsForAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, visibility, includeDeleted } = req.query

      const playlists = await this.playlistService.getAllPlaylistsForAdmin({
        ...(status && {
          status: status === 'ALL' ? 'ALL' : (status as PlaylistStatus),
        }),

        ...(visibility && {
          visibility: visibility === 'ALL' ? 'ALL' : (visibility as Visibility),
        }),

        ...(includeDeleted !== undefined && {
          includeDeleted: includeDeleted === 'true',
        }),
      })

      res.status(200).json(playlists)
    } catch (err) {
      next(err)
    }
  }


  //get videos for admin
  async getVideosInPlaylistForAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Parse and validate UUID from params
      const uuid = uuidParamSchema.parse(req.params.uuid)

      // Read query params for filtering
      const { status, includeDeleted } = req.query

      // Call service with filters, defaults handled in service
      const videosInPlaylist = await this.playlistService.getVideosByPlaylistUuidForAdmin(uuid, {
        ...(status && {
          status: status === 'ALL' ? 'ALL' : (status as PlaylistStatus),
        }),
        ...(includeDeleted !== undefined && {
          includeDeleted: includeDeleted === 'true',
        }),
      })

      res.status(200).json(videosInPlaylist)
    } catch (err) {
      next(err)
    }
  }

  async getUserPlaylist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uuid = uuidParamSchema.parse(req.params.uuid)
      const playlist = await this.playlistService.getUserPlaylist(uuid)
      res.status(200).json(playlist)
    } catch (err) {
      next(err)
    }
  }
  async getAdminPlaylist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate path param
      const uuid = uuidParamSchema.parse(req.params.uuid)

      const playlist = await this.playlistService.getAdminPlaylist(uuid)

      res.status(200).json(playlist)
    } catch (err) {
      next(err)
    }
  }

  // get single playlist info for admin
  // -------------------- CREATE --------------------

  async createPlaylist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = createPlaylistSchema.parse(req.body)

      const newPlaylist = await this.playlistService.createPlaylist(dto)

      res.status(201).json(newPlaylist)
    } catch (err) {
      next(err)
    }
  }

  // -------------------- UPDATE --------------------

  async updatePlaylist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uuid = uuidParamSchema.parse(req.params.uuid)

      const data = updatePlaylistSchema.parse(req.body)

      await this.playlistService.updatePlaylist(uuid, data)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  // -------------------- DELETE --------------------

  async deletePlaylist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uuid = uuidParamSchema.parse(req.params.uuid)
      await this.playlistService.deletePlaylist(uuid)

      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  async createVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlistUUID = uuidParamSchema.parse(req.params.uuid)
      const dto = createVideoSchema.parse(req.body)
      // ------------------- Call Service -------------------
      await this.playlistService.createVideo(playlistUUID, dto)
      res.status(201).end()
    } catch (err) {
      next(err)
    }
  }
}
