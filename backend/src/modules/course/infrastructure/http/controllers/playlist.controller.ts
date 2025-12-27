import type { Request, Response } from 'express';
import { PlaylistPrismaRepository } from '../../prisma/repository/playlist.prisma.repository';
import { PlaylistService } from '@/modules/course/application/service/playlist.service';
import { logger } from '@/utils/logger';

// DTOs for request validation / API shape
interface CreatePlaylistDto {
  title: string;
  description?: string;
  playlistThumbnailUrl?: string;
  order?: number;
}

interface UpdatePlaylistDto {
  title?: string;
  description?: string;
  playlistThumbnailUrl?: string;
  order?: number;
}

export class PlaylistController {
  private prismaRepo = new PlaylistPrismaRepository();
  private playlistService = new PlaylistService(this.prismaRepo);

  // -------------------- READ --------------------

  async getAllPlaylists(req: Request, res: Response): Promise<Response> {
    logger.info('Fetching all playlists');
    const playlists = await this.playlistService.getAllPlaylists();
    logger.info('Fetched %d playlists', playlists.length);
    return res.status(200).json(playlists);
  }

  async getVideosInPlaylistByUuid(req: Request, res: Response): Promise<Response> {
    const uuid = req.params.uuid;
    if (!uuid || uuid.trim() === '') {
      logger.warn('UUID is missing or empty');
      return res.status(400).json({ error: 'UUID is required' });
    }

    logger.info('Fetching playlist with UUID: %s', uuid);
    const videosInPlaylist = await this.playlistService.getVideosInPlaylistByUuid(uuid);

    if (!videosInPlaylist) {
      logger.warn('Playlist not found with UUID: %s', uuid);
      return res.status(404).json({ error: 'Playlist not found' });
    }

    logger.info('Videos in playlist was found: %s', videosInPlaylist);
    return res.status(200).json(videosInPlaylist);
  }

  // -------------------- CREATE --------------------

  async createPlaylist(req: Request, res: Response): Promise<Response> {
    const dto: CreatePlaylistDto = req.body;

    if (!dto.title || dto.title.trim() === '') {
      logger.warn('Create playlist request missing title');
      return res.status(400).json({ error: 'Title is required' });
    }

    logger.info('Creating playlist: %s', dto.title);
    const newPlaylist = await this.playlistService.createPlaylist(dto);
    logger.info('Playlist created with UUID: %s', newPlaylist.uuid);
    return res.status(201).json(newPlaylist);
  }

  // -------------------- UPDATE --------------------

  async updatePlaylist(req: Request, res: Response): Promise<Response> {
    const uuid = req.params.uuid;
    if (!uuid || uuid.trim() === '') {
      logger.warn('UUID is missing or empty for update');
      return res.status(400).json({ error: 'UUID is required' });
    }

    const dto: UpdatePlaylistDto = req.body;

    if (dto.title !== undefined && dto.title.trim() === '') {
      logger.warn('Update playlist request has empty title');
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    logger.info('Updating playlist with UUID: %s', uuid);
    const updatedPlaylist = await this.playlistService.updatePlaylist(uuid, dto);

    if (!updatedPlaylist) {
      logger.warn('Playlist not found for update UUID: %s', uuid);
      return res.status(404).json({ error: 'Playlist not found' });
    }

    logger.info('Playlist updated: %s', updatedPlaylist.title);
    return res.status(200).json(updatedPlaylist);
  }

  // -------------------- DELETE --------------------

  async deletePlaylist(req: Request, res: Response): Promise<Response> {
    const uuid = req.params.uuid;
    if (!uuid || uuid.trim() === '') {
      logger.warn('UUID is missing or empty for delete');
      return res.status(400).json({ error: 'UUID is required' });
    }

    logger.info('Deleting playlist with UUID: %s', uuid);
    const deleted = await this.playlistService.deletePlaylist(uuid);

    if (!deleted) {
      logger.warn('Playlist not found for delete UUID: %s', uuid);
      return res.status(404).json({ error: 'Playlist not found' });
    }

    logger.info('Playlist deleted with UUID: %s', uuid);
    return res.status(200).json({ message: 'Playlist deleted successfully' });
  }
}
