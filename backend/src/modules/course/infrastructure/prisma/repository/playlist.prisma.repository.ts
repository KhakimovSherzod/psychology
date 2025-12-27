import type { IPlaylistRespository } from '@/modules/course/application/repository/playlist.repository'
import { Playlist } from '@/modules/course/domain/entities/playlist.entity'
import { Video } from '@/modules/course/domain/entities/video.entity'
import { prisma } from '@/shared/client'

interface CreatePlaylistDto {
  title: string
  description?: string
  playlistThumbnailUrl?: string
  order?: number
  courseId: number
}

interface UpdatePlaylistDto {
  title?: string | undefined
  description?: string | undefined
  playlistThumbnailUrl?: string | undefined
  order?: number | undefined
}

export class PlaylistPrismaRepository implements IPlaylistRespository {
  // -------------------- READ --------------------
  async getCoursePlaylists(): Promise<Playlist[]> {
    const playlists = await prisma.playlist.findMany({
      select: {
        uuid: true,
        title: true,
        description: true,
        playlistThumbnailUrl: true,
        order: true,
      },
      orderBy: {
        order: 'asc',
      },
    })

    return playlists.map(
      playlist =>
        new Playlist(
          playlist.uuid,
          playlist.title,
          playlist.description ?? undefined,
          playlist.playlistThumbnailUrl ?? undefined
        )
    )
  }

  async getVideosInPlaylistByUuid(uuid: string): Promise<Video[] | null> {
    const videosInPlaylist = await prisma.playlist.findUnique({
      where: { uuid },
      select: {
        videos: {
          select: {
            uuid: true,
            title: true,
            description: true,
            playbackUrl: true,
            videoThumbnailUrl: true,
            order: true,
            categories: {
              select: {
                uuid: true,
                name: true,
              },
            },
            playlistId: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!videosInPlaylist) return null

    return videosInPlaylist.videos.map(
      video =>
        new Video(
          video.uuid,
          video.title,
          video.playbackUrl,
          uuid,
          video.description ?? undefined,
          video.videoThumbnailUrl ?? undefined,
          video.order ?? undefined,
          video.categories ?? []
        )
    )
  }

  // -------------------- CREATE --------------------
  async createPlaylist(data: CreatePlaylistDto): Promise<Playlist> {
    const playlist = await prisma.playlist.create({
      data,
      select: {
        uuid: true,
        title: true,
        description: true,
        playlistThumbnailUrl: true,
        order: true,
      },
    })

    return new Playlist(
      playlist.uuid,
      playlist.title,
      playlist.description ?? undefined,
      playlist.playlistThumbnailUrl ?? undefined
    )
  }

  // -------------------- UPDATE --------------------
  async updatePlaylist(uuid: string, data: UpdatePlaylistDto): Promise<Playlist | null> {
    try {
      // Build the data object for Prisma update with only defined fields
      const updateData: Record<string, any> = {}
      if (data.title !== undefined) updateData.title = data.title
      if (data.description !== undefined) updateData.description = data.description
      if (data.playlistThumbnailUrl !== undefined)
        updateData.playlistThumbnailUrl = data.playlistThumbnailUrl
      if (data.order !== undefined) updateData.order = data.order

      // If nothing to update, return the existing playlist
      if (Object.keys(updateData).length === 0) {
        const existing = await prisma.playlist.findUnique({
          where: { uuid },
          select: {
            uuid: true,
            title: true,
            description: true,
            playlistThumbnailUrl: true,
            order: true,
          },
        })
        if (!existing) return null
        return new Playlist(
          existing.uuid,
          existing.title,
          existing.description ?? undefined,
          existing.playlistThumbnailUrl ?? undefined
        )
      }

      // Perform the update
      const updated = await prisma.playlist.update({
        where: { uuid },
        data: updateData, // only defined fields here
        select: {
          uuid: true,
          title: true,
          description: true,
          playlistThumbnailUrl: true,
          order: true,
        },
      })

      return new Playlist(
        updated.uuid,
        updated.title,
        updated.description ?? undefined,
        updated.playlistThumbnailUrl ?? undefined
      )
    } catch (err: any) {
      if (err.code === 'P2025') return null // record not found
      throw err
    }
  }

  // -------------------- DELETE --------------------
  async deletePlaylist(uuid: string): Promise<boolean> {
    try {
      await prisma.playlist.delete({ where: { uuid } })
      return true
    } catch (err: any) {
      if (err.code === 'P2025') return false
      throw err
    }
  }

  // -------------------- UPSERT --------------------
  async upsertPlaylist(playlist: Playlist): Promise<Playlist> {
    const existing = await prisma.playlist.findUnique({
      where: { uuid: playlist.uuid },
      select: { uuid: true },
    })

    // Prepare update object (only include defined fields)
    const updateData: Record<string, any> = {}
    if (playlist.title !== undefined) updateData.title = playlist.title
    if (playlist.description !== undefined) updateData.description = playlist.description
    if (playlist.playlistThumbnailUrl !== undefined)
      updateData.playlistThumbnailUrl = playlist.playlistThumbnailUrl

    if (existing) {
      // If nothing to update, return existing playlist
      if (Object.keys(updateData).length === 0) {
        const existingPlaylist = await prisma.playlist.findUnique({
          where: { uuid: playlist.uuid },
          select: {
            uuid: true,
            title: true,
            description: true,
            playlistThumbnailUrl: true,
            order: true,
          },
        })
        return new Playlist(
          existingPlaylist!.uuid,
          existingPlaylist!.title,
          existingPlaylist!.description ?? undefined,
          existingPlaylist!.playlistThumbnailUrl ?? undefined
        )
      }

      // Update existing
      const updated = await prisma.playlist.update({
        where: { uuid: playlist.uuid },
        data: updateData,
        select: {
          uuid: true,
          title: true,
          description: true,
          playlistThumbnailUrl: true,
          order: true,
        },
      })

      return new Playlist(
        updated.uuid,
        updated.title,
        updated.description ?? undefined,
        updated.playlistThumbnailUrl ?? undefined
      )
    }

    // Create new playlist
    const created = await prisma.playlist.create({
      data: {
        uuid: playlist.uuid,
        title: playlist.title,
        description: playlist.description ?? '',
        playlistThumbnailUrl: playlist.playlistThumbnailUrl ?? '',
      },
      select: {
        uuid: true,
        title: true,
        description: true,
        playlistThumbnailUrl: true,
        order: true,
      },
    })

    return new Playlist(
      created.uuid,
      created.title,
      created.description ?? undefined,
      created.playlistThumbnailUrl ?? undefined
    )
  }
}
