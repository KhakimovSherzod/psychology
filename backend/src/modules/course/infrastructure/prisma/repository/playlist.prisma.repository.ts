import { Playlist } from '@/modules/course/domain/entities/playlist.entity'
import { Video } from '@/modules/course/domain/entities/video.entity'
import type { IPlaylistRespository } from '@/modules/course/domain/repository/playlist.repository'
import { PriceVO } from '@/modules/course/domain/vo/price.vo'
import { prisma } from '@/shared/client'
import { PlaylistNotFound } from '@/shared/errors/repository/PlaylistNotFound'
import { PlaylistStatus, Prisma, Visibility } from '@prisma/client'

interface UpdatePlaylistDto {
  title?: string
  description?: string
  playlistThumbnailUrl?: string
}

export class PlaylistPrismaRepository implements IPlaylistRespository {
  save(playlist: Playlist): Promise<void> {
    throw new Error('Method not implemented.')
  }
  // -------------------- READ --------------------

  async getCoursePlaylists(options?: {
    status?: PlaylistStatus | 'ALL'
    visibility?: Visibility | 'ALL'
    includeDeleted?: boolean
  }): Promise<Playlist[]> {
    const {
      status = PlaylistStatus.PUBLISHED, // user default
      visibility = Visibility.PUBLIC, // user default
      includeDeleted = false,
    } = options ?? {}

    const where: Prisma.playlistWhereInput = {}

    // Apply status filter only if not ALL
    if (status !== 'ALL') {
      where.status = status
    }

    // Apply visibility filter only if not ALL
    if (visibility !== 'ALL') {
      where.visibility = visibility
    }

    // Soft delete handling
    if (!includeDeleted) {
      where.deletedAt = null
    }

    const playlists = await prisma.playlist.findMany({
      where,
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id:true,
        uuid: true,
        title: true,
        visibility: true,
        status: true,
        description: true,
        playlistThumbnailUrl: true,
        price: true,
        categories: {
          select: {
            uuid: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        publishedAt: true,
        archivedAt: true,
      },
    })

return playlists.map(p =>
  Playlist.reconstruct({
    uuid: p.uuid,
    title: p.title,
    visibility: p.visibility,
    status: p.status,
    categories: p.categories,
    price: p.price ? PriceVO.fromNumber(p.price) : new PriceVO(null),
    ...(p.description != null && { description: p.description }),
    ...(p.playlistThumbnailUrl != null && { playlistThumbnailUrl: p.playlistThumbnailUrl }),
    ...(p.createdAt != null && { createdAt: p.createdAt }),
    ...(p.updatedAt != null && { updatedAt: p.updatedAt }),
    ...(p.deletedAt != null && { deletedAt: p.deletedAt }),
    ...(p.publishedAt != null && { publishedAt: p.publishedAt }),
    ...(p.archivedAt != null && { archivedAt: p.archivedAt }),
    videos: [],
    internalId: p.id
  })
)
  }

  async getVideosInPlaylistByUuid(
    uuid: string,
    options?: {
      status?: PlaylistStatus | 'ALL'
      includeDeleted?: boolean
    }
  ): Promise<Video[]> {
    const { status = 'PUBLISHED', includeDeleted = false } = options ?? {}

    const playlist = await prisma.playlist.findUnique({
      where: { uuid },
      select: {
        videos: {
          where: {
            ...(!includeDeleted && { deletedAt: null }),
            ...(status !== 'ALL' && { status }),
          },
          orderBy: {
            order: 'asc',
          },
          select: {
            uuid: true,
            provider: true,
            externalVideoId: true,
            title: true,
            description: true,
            videoThumbnailUrl: true,
            status: true,
            order: true,
            isFree: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            publishedAt: true,
            archivedAt: true,
            categories: {
              select: {
                uuid: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!playlist) throw new PlaylistNotFound('Pleylist topilmadi', uuid)

    return playlist.videos.map(v =>
      Video.reconstruct({
        uuid: v.uuid,
        provider: v.provider,
        externalVideoId: v.externalVideoId,
        title: v.title,
        videoThumbnailUrl: v.videoThumbnailUrl,
        status: v.status,
        order: v.order,
        categories: v.categories,
        isFree: v.isFree,
        createdAt: v.createdAt,
        ...(v.description != null && { description: v.description }),
        ...(v.updatedAt != null && { updatedAt: v.updatedAt }),
        ...(v.deletedAt != null && { deletedAt: v.deletedAt }),
        ...(v.publishedAt != null && { publishedAt: v.publishedAt }),
        ...(v.archivedAt != null && { archivedAt: v.archivedAt }),
      })
    )
  }

async findByUUID(uuid: string): Promise<Playlist> {
  const playlist = await prisma.playlist.findFirst({
    where: { uuid },
    include: {
      categories: { select: { uuid: true, name: true } },
      videos: {
        orderBy: { order: 'asc' },
        select: {
          uuid: true,
          provider: true,
          externalVideoId: true,
          title: true,
          description: true,
          videoThumbnailUrl: true,
          status: true,
          order: true,
          isFree: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          publishedAt: true,
          archivedAt: true,
          categories: { select: { uuid: true, name: true } },
        },
      },
    },
  });

  if (!playlist) {
    throw new PlaylistNotFound('Playlist not found', uuid);
  }

  const price = new PriceVO(playlist.price ?? null);
  const categories = playlist.categories.map(c => ({ uuid: c.uuid, name: c.name }));

  return Playlist.reconstruct({
    uuid: playlist.uuid,
    title: playlist.title,
    visibility: playlist.visibility,
    status: playlist.status,
    categories,
    price,
    videos: playlist.videos.map(v => Video.reconstruct({
      uuid: v.uuid,
      provider: v.provider,
      externalVideoId: v.externalVideoId,
      title: v.title,
      videoThumbnailUrl: v.videoThumbnailUrl,
      status: v.status,
      order: v.order,
      categories: v.categories,
      isFree: v.isFree,
      createdAt: v.createdAt,
      ...(v.description != null && { description: v.description }),
      ...(v.updatedAt != null && { updatedAt: v.updatedAt }),
      ...(v.deletedAt != null && { deletedAt: v.deletedAt }),
      ...(v.publishedAt != null && { publishedAt: v.publishedAt }),
      ...(v.archivedAt != null && { archivedAt: v.archivedAt }),
    })),
    ...(playlist.description != null && { description: playlist.description }),
    ...(playlist.playlistThumbnailUrl != null && { playlistThumbnailUrl: playlist.playlistThumbnailUrl }),
    ...(playlist.createdAt != null && { createdAt: playlist.createdAt }),
    ...(playlist.updatedAt != null && { updatedAt: playlist.updatedAt }),
    ...(playlist.deletedAt != null && { deletedAt: playlist.deletedAt }),
    ...(playlist.publishedAt != null && { publishedAt: playlist.publishedAt }),
    ...(playlist.archivedAt != null && { archivedAt: playlist.archivedAt }),
    internalId: playlist.id
  });
}


  // -------------------- CREATE --------------------

async createPlaylist(playlist: Playlist): Promise<Playlist> {
  const now = new Date();

  const saved = await prisma.playlist.create({
    data: {
      uuid: playlist.id,
      title: playlist.titleValue,
      visibility: playlist.visibilityValue,
      status: playlist.statusValue,
      price: playlist.priceValue.amount,
      createdAt: playlist.createdAtValue ?? now,
      updatedAt: playlist.updatedAtValue ?? now,
      ...(playlist.descriptionValue !== undefined && { description: playlist.descriptionValue }),
      ...(playlist.playlistThumbnailUrlValue !== undefined && { playlistThumbnailUrl: playlist.playlistThumbnailUrlValue }),
    },
    select: {
      id: true,
      uuid: true,
      title: true,
      description: true,
      playlistThumbnailUrl: true,
      visibility: true,
      status: true,
      categories: {
        select: {
          uuid: true,
          name: true,
        },
      },
      price: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      publishedAt: true,
      archivedAt: true,
    },
  });

  return Playlist.reconstruct({
    uuid: saved.uuid,
    title: saved.title,
    visibility: saved.visibility,
    status: saved.status,
    categories: saved.categories.map(c => ({ uuid: c.uuid, name: c.name })),
    price: saved.price ? PriceVO.fromNumber(saved.price) : new PriceVO(null),
    videos: [], // no videos yet
    ...(saved.description != null && { description: saved.description }),
    ...(saved.playlistThumbnailUrl != null && { playlistThumbnailUrl: saved.playlistThumbnailUrl }),
    ...(saved.createdAt != null && { createdAt: saved.createdAt }),
    ...(saved.updatedAt != null && { updatedAt: saved.updatedAt }),
    ...(saved.deletedAt != null && { deletedAt: saved.deletedAt }),
    ...(saved.publishedAt != null && { publishedAt: saved.publishedAt }),
    ...(saved.archivedAt != null && { archivedAt: saved.archivedAt }),
    internalId: saved.id,
  });
}

  // -------------------- UPDATE --------------------

  async updatePlaylist(uuid: string, data: UpdatePlaylistDto): Promise<Playlist | null> {
    try {
      const updated = await prisma.playlist.update({
        where: { uuid },
        data
      })

      return new Playlist(
        updated.uuid,
        updated.title,
        updated.description ?? undefined,
        updated.playlistThumbnailUrl ?? undefined
      )
    } catch (err: any) {
      if (err.code === 'P2025') return null
      throw err
    }
  }

  // -------------------- DELETE (SOFT) --------------------

  async deletePlaylist(uuid: string): Promise<boolean> {
    try {
      await prisma.playlist.update({
        where: { uuid },
        data: { deletedAt: new Date() },
      })
      return true
    } catch (err: any) {
      if (err.code === 'P2025') return false
      throw err
    }
  }

async savePlaylistVideos(playlist: Playlist): Promise<void> {
  const videos = [...playlist.videosValue];

  // 1️⃣ Fetch numeric playlist id from DB (based on UUID)
  const dbPlaylist = await prisma.playlist.findUnique({
    where: { uuid: playlist.id },
    select: { id: true },
  });
  if (!dbPlaylist) throw new PlaylistNotFound('Playlist not found in DB', playlist.id);
  const playlistDbId = dbPlaylist.id;

  // 2️⃣ Fetch all existing videos in the playlist, including deleted
  const existingVideos = await prisma.video.findMany({
    where: { playlistId: playlistDbId },
    select: { uuid: true, order: true },
  });

  // 3️⃣ Build a map of all used orders
  const allOrders = new Map<number, string>();
  for (const v of existingVideos) {
    allOrders.set(v.order, v.uuid);
  }

  // 4️⃣ Assign final orders in memory
  videos.sort((a, b) => a.orderValue - b.orderValue);
  for (const video of videos) {
    let order = video.orderValue;
    // Shift orders until a free spot is found
    while (allOrders.has(order)) order += 1;
    video.orderValue = order;
    allOrders.set(order, video.id);
  }

  // 5️⃣ Upsert videos in a transaction
  await prisma.$transaction(async (tx) => {
    for (const video of videos) {
      // Skip deleted videos (cannot modify)
      if (video.deletedAtValue) continue;

      await tx.video.upsert({
        where: { uuid: video.id },
        update: {
          title: video.titleValue,
          videoThumbnailUrl: video.videoThumbnailUrlValue,
          status: video.statusValue,
          order: video.orderValue,
          isFree: video.isFreeValue,
          ...(video.descriptionValue ? { description: video.descriptionValue } : {}),
          updatedAt: video.updatedAtValue ?? new Date(),
          ...(video.categoriesValue.length
            ? { categories: { set: video.categoriesValue.map(c => ({ uuid: c.uuid })) } }
            : {}),
          playlistId: playlistDbId,
        },
        create: {
          uuid: video.id,
          provider: video.providerValue,
          externalVideoId: video.externalId,
          title: video.titleValue,
          videoThumbnailUrl: video.videoThumbnailUrlValue,
          status: video.statusValue,
          order: video.orderValue,
          isFree: video.isFreeValue,
          playlistId: playlistDbId,
          ...(video.descriptionValue ? { description: video.descriptionValue } : {}),
          createdAt: video.createdAtValue ?? new Date(),
          updatedAt: video.updatedAtValue ?? new Date(),
          ...(video.categoriesValue.length
            ? { categories: { connect: video.categoriesValue.map(c => ({ uuid: c.uuid })) } }
            : {}),
        },
      });
    }
  });
}

async findExistingUuids(uuids: string[]): Promise<string[]> {
  if (!uuids.length) return [];

  const playlists = await prisma.playlist.findMany({
    where: {
      uuid: { in: uuids },
      deletedAt: null,
    },
    select: { uuid: true },
  });

  return playlists.map(p => p.uuid);
}


}
