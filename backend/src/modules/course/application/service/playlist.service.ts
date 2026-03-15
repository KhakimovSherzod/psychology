import  { EnrollmentService } from './../../../enrollment/application/service/enrollment.service';
import { type UpdatePlaylistInput } from './../../infrastructure/validator/update.playlist.validator'

import { Playlist } from '@/modules/course/domain/entities/playlist.entity'

import type { PlaylistStatus, Visibility } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { Video } from '../../domain/entities/video.entity'
import type { IPlaylistRespository } from '../../domain/repository/playlist.repository'
import { PriceVO } from '../../domain/vo/price.vo'
import type { CreateVideoDto } from '../../infrastructure/validator/create.video.validator'
import type { CreatePlaylistInput } from '../../infrastructure/validator/createPlaylistSchema'
import type { PlaylistAdminDTO, PlaylistUserDTO } from '../DTO/playlist.response.dto'
import type { VideoAdminDTO, VideoUserDTO } from '../DTO/video.user.dto'
import type { IUserRepository } from '@/modules/user/application/repositories/user.repository';

export class PlaylistService {
  constructor(
    private playlistRepository: IPlaylistRespository,
    private readonly enrollmentService:EnrollmentService,
    private readonly userRepository: IUserRepository
  ) {}

  // -------------------- READ --------------------
  // users
async getAllPlaylists(userUUID: string): Promise<PlaylistUserDTO[]> {
  
  const playlists = await this.playlistRepository.getCoursePlaylists();


  return playlists.map(playlist => {
    //todo need to check enrollment
    const hasAccess = true;

    return {
      id: playlist.id,
      title: playlist.titleValue,
      price: playlist.priceValue.amount,
      categories: playlist.categoriesValue,
      hasAccess,
      ...(playlist.descriptionValue && { description: playlist.descriptionValue }),
    } as PlaylistUserDTO;
  });
}


async getVideosByPlaylistUuidForUser(userUUID: string, playlistUUID: string): Promise<VideoUserDTO[] | null> {

  // 2️⃣ Check if user has access
  const hasEnrollmentAccess = await this.enrollmentService.userHasAccess(userUUID, playlistUUID);

  // 3️⃣ Load videos
  const videos = await this.playlistRepository.getVideosInPlaylistByUuid(playlistUUID);
  if (!videos) return null;

  // 4️⃣ Map videos to DTOs with access info
  return videos.map(video => ({
    uuid: video.id,
    title: video.titleValue,
    videoThumbnailUrl: video.videoThumbnailUrlValue,
    order: video.orderValue,
    isFree: video.isFreeValue,
    categories: video.categoriesValue.map(c => ({ id: c.uuid, name: c.name })),
    ...(video.descriptionValue && { description: video.descriptionValue }),
    hasAccess: video.isFreeValue || hasEnrollmentAccess,
  }));
}


  
  async getAllPlaylistsForAdmin(options?: {
    status?: PlaylistStatus | 'ALL'
    visibility?: Visibility | 'ALL'
    includeDeleted?: boolean // default: true
  }): Promise<PlaylistAdminDTO[]> {
    const { status = 'ALL', visibility = 'ALL', includeDeleted = true } = options ?? {}

    const playlists = await this.playlistRepository.getCoursePlaylists({
      ...(status !== undefined && { status }),
      ...(visibility !== undefined && { visibility }),
      ...(includeDeleted !== undefined && { includeDeleted }),
    })

    return playlists.map(playlist => {
      const dto: PlaylistAdminDTO = {
        id: playlist.id,
        title: playlist.titleValue,
        visibility: playlist.visibilityValue,
        status: playlist.statusValue,
        price: playlist.priceValue.amount,
        categories: playlist.categoriesValue,

        ...(playlist.descriptionValue !== undefined && {
          description: playlist.descriptionValue,
        }),
        ...(playlist.playlistThumbnailUrlValue !== undefined && {
          playlistThumbnailUrl: playlist.playlistThumbnailUrlValue,
        }),
        ...(playlist.createdAtValue !== undefined && {
          createdAt: playlist.createdAtValue,
        }),
        ...(playlist.updatedAtValue !== undefined && {
          updatedAt: playlist.updatedAtValue,
        }),
        ...(playlist.publishedAtValue !== undefined && {
          publishedAt: playlist.publishedAtValue,
        }),
        ...(playlist.archivedAtValue !== undefined && {
          archivedAt: playlist.archivedAtValue,
        }),
      }

      return dto
    })
  }
  /** Get videos for an admin */
  async getVideosByPlaylistUuidForAdmin(
    uuid: string,
    options?: {
      status?: PlaylistStatus | 'ALL'
      includeDeleted?: boolean
    }
  ): Promise<VideoAdminDTO[]> {
    // Set defaults: all statuses, include deleted
    const { status = 'ALL', includeDeleted = true } = options ?? {}

    // Get videos from repository with filters
    const videos = await this.playlistRepository.getVideosInPlaylistByUuid(uuid, {
      status,
      includeDeleted: includeDeleted,
    })

    return videos.map(video => ({
      uuid: video['uuid'],
      provider: video['provider'],
      externalVideoId: video['externalVideoId'],
      title: video['title'],
      videoThumbnailUrl: video['videoThumbnailUrl'],
      status: video['status'],
      order: video['order'],
      categories: video.categoriesValue.map(c => ({ id: c.uuid, name: c.name })),
      isFree: video['isFree'],
      ...(video['createdAt'] !== undefined && { createdAt: video['createdAt'] }),
      ...(video['description'] !== undefined && { description: video['description'] }),
      ...(video['updatedAt'] !== undefined && { updatedAt: video['updatedAt'] }),
      ...(video['deletedAt'] !== undefined && { deletedAt: video['deletedAt'] }),
      ...(video['publishedAt'] !== undefined && { publishedAt: video['publishedAt'] }),
      ...(video['archivedAt'] !== undefined && { archivedAt: video['archivedAt'] }),
    }))
  }

  async getUserPlaylist(uuid: string): Promise<PlaylistUserDTO> {
    const playlist = await this.playlistRepository.findByUUID(uuid)

    playlist.ensureVisibleToUser()

    return {
      id: playlist.id,
      title: playlist.titleValue,
      price: playlist.priceValue.amount,
      //todo logic for this has access here 
      hasAccess:true,

      categories: playlist.categoriesValue,
      ...(playlist.descriptionValue !== undefined && {
        description: playlist.descriptionValue,
      }),
      ...(playlist.playlistThumbnailUrlValue !== undefined && {
        playlistThumbnailUrl: playlist.playlistThumbnailUrlValue,
      }),
    }
  }

  async getAdminPlaylist(uuid: string): Promise<PlaylistAdminDTO> {
    const playlist = await this.playlistRepository.findByUUID(uuid)

    return {
      id: playlist.id,
      title: playlist.titleValue,
      visibility: playlist.visibilityValue,
      status: playlist.statusValue,

      price: playlist.priceValue.amount,

      categories: playlist.categoriesValue,

      ...(playlist.descriptionValue !== undefined && {
        description: playlist.descriptionValue,
      }),

      ...(playlist.playlistThumbnailUrlValue !== undefined && {
        playlistThumbnailUrl: playlist.playlistThumbnailUrlValue,
      }),

      ...(playlist.createdAtValue && {
        createdAt: playlist.createdAtValue,
      }),

      ...(playlist.updatedAtValue && {
        updatedAt: playlist.updatedAtValue,
      }),

      ...(playlist.publishedAtValue && {
        publishedAt: playlist.publishedAtValue,
      }),

      ...(playlist.archivedAtValue && {
        archivedAt: playlist.archivedAtValue,
      }),
    }
  }

  // -------------------- CREATE --------------------
 async createPlaylist(data: CreatePlaylistInput): Promise<PlaylistAdminDTO> {
  const newUuid = uuidv4()


  // Reconstruct the Playlist entity
  const playlist = Playlist.reconstruct({
    uuid: newUuid,
    title: data.title,
    visibility: data.visibility,
    status: data.status,
    categories: data.categories,
    price: data.price,
    playlistThumbnailUrl: data.playlistThumbnailUrl, // optional
    createdAt: new Date(),
    updatedAt: new Date()
    description: data.description,             // optional
  })

  const savedPlaylist = await this.playlistRepository.createPlaylist(playlist)

  // Construct DTO manually
  const playlistDTO: PlaylistAdminDTO = {
    id: savedPlaylist.id,
    title: savedPlaylist.titleValue,
    visibility: savedPlaylist.visibilityValue,
    status: savedPlaylist.statusValue,
    price: savedPlaylist.priceValue.amount,
    categories: savedPlaylist.categoriesValue,
    ...(savedPlaylist.descriptionValue && { description: savedPlaylist.descriptionValue }),
    ...(savedPlaylist.playlistThumbnailUrlValue && {
      playlistThumbnailUrl: savedPlaylist.playlistThumbnailUrlValue,
    }),
    ...(savedPlaylist.createdAtValue && { createdAt: savedPlaylist.createdAtValue }),
    ...(savedPlaylist.updatedAtValue && { updatedAt: savedPlaylist.updatedAtValue }),
    ...(savedPlaylist.publishedAtValue && { publishedAt: savedPlaylist.publishedAtValue }),
    ...(savedPlaylist.archivedAtValue && { archivedAt: savedPlaylist.archivedAtValue }),
  }

  return playlistDTO
}

  // -------------------- UPDATE --------------------
  async updatePlaylist(uuid: string, data: UpdatePlaylistInput): Promise<Playlist | null> {
    return await this.playlistRepository.updatePlaylist(uuid, data)
  }

  // -------------------- DELETE --------------------
  async deletePlaylist(uuid: string): Promise<boolean> {
    return await this.playlistRepository.deletePlaylist(uuid)
  }

  async createVideo(playlistUUID: string, dto: CreateVideoDto): Promise<void> {
    // 1️⃣ Load Playlist aggregate
    const playlist = await this.playlistRepository.findByUUID(playlistUUID)
    const newUUID = uuidv4()

    const NewVideo = Video.create({
      uuid: newUUID,
      provider: dto.provider,
      externalVideoId: dto.externalVideoId,
      title: dto.title,
      videoThumbnailUrl: dto.videoThumbnailUrl,
      status: dto.status,
      categories: dto.categories,
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.order !== undefined ? { order: dto.order } : { order: 0 }),
      isFree: dto.isFree,
    })

    // 2️⃣ Add Video via aggregate root
    playlist.addVideo(NewVideo)

    // 3️⃣ Save Playlist aggregate
    await this.playlistRepository.savePlaylistVideos(playlist)
  }
}
