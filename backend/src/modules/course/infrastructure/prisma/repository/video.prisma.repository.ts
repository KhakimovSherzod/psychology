import type { IVideoRepository } from '@/modules/course/application/repository/video.repository'
import type { CreateVideoDto } from '@/modules/course/application/service/video.service'
import { Video } from '@/modules/course/domain/entities/video.entity'
import { prisma } from '@/shared/client'

export class VideoPrismaRepository implements IVideoRepository {
  // -------------------- CREATE --------------------
  async createVideo(data: CreateVideoDto): Promise<Video> {
    const connectCategories = data.categories?.map(uuid => ({ uuid })) || []

    const video = await prisma.video.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        playbackUrl: data.playbackUrl,
        videoThumbnailUrl: data.videoThumbnailUrl ?? null,
        playlist: { connect: { uuid: data.playlistId } },
        categories: { connect: connectCategories },
      },
      include: {
        playlist: { select: { uuid: true } },
        categories: { select: { uuid: true } },
      },
    })

    return new Video(
      video.uuid,
      video.title,
      video.playbackUrl,
      video.playlist.uuid,
      video.description ?? undefined,
      video.videoThumbnailUrl ?? undefined,
      video.order ?? undefined,
      video.categories?.map(cat => cat.uuid)
    )
  }

  // -------------------- GET ALL --------------------
  async getAllVideos(): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        playlist: { select: { uuid: true } },
        categories: { select: { uuid: true } },
      },
    })

    return videos.map(
      video =>
        new Video(
          video.uuid,
          video.title,
          video.playbackUrl,
          video.playlist.uuid,
          video.description ?? undefined,
          video.videoThumbnailUrl ?? undefined,
          video.order ?? undefined,
          video.categories?.map(cat => cat.uuid)
        )
    )
  }

  // -------------------- UPSERT --------------------
  async upsertVideo(video: Video): Promise<Video> {
    const connectCategories = video.categories?.map(uuid => ({ uuid })) || []

    // Prepare data object (omit undefined)
    const updateData: Record<string, any> = {}
    if (video.title !== undefined) updateData.title = video.title
    if (video.description !== undefined) updateData.description = video.description
    if (video.playbackUrl !== undefined) updateData.playbackUrl = video.playbackUrl
    if (video.videoThumbnailUrl !== undefined)
      updateData.videoThumbnailUrl = video.videoThumbnailUrl
    if (video.playlistId !== undefined)
      updateData.playlist = { connect: { uuid: video.playlistId } }
    if (video.order !== undefined) updateData.order = video.order
    if (connectCategories.length > 0) updateData.categories = { set: connectCategories }

    // Check if video exists
    const existing = await prisma.video.findUnique({
      where: { uuid: video.uuid },
      select: { uuid: true },
    })

    if (existing) {
      const updated = await prisma.video.update({
        where: { uuid: video.uuid },
        data: updateData,
        include: {
          playlist: { select: { uuid: true } },
          categories: { select: { uuid: true, name:true } },
        },
      })

      return new Video(
        updated.uuid,
        updated.title,
        updated.playbackUrl,
        updated.playlist.uuid,
        updated.description ?? undefined,
        updated.videoThumbnailUrl ?? undefined,
        updated.order ?? undefined,
        updated.categories?.map(cat => ({ uuid: cat.uuid, name: cat.name }))
      )
    }

    // Create new video
    const created = await prisma.video.create({
      data: {
        uuid: video.uuid,
        title: video.title,
        description: video.description ?? null,
        playbackUrl: video.playbackUrl,
        videoThumbnailUrl: video.videoThumbnailUrl ?? null,
        playlist: { connect: { uuid: video.playlistId } },
        categories: { connect: connectCategories },
      },
      include: {
        playlist: { select: { uuid: true } },
        categories: { select: { uuid: true } },
      },
    })

    return new Video(
      created.uuid,
      created.title,
      created.playbackUrl,
      created.playlist.uuid,
      created.description ?? undefined,
      created.videoThumbnailUrl ?? undefined,
      created.order ?? undefined,
      created.categories?.map(cat => cat.uuid)
    )
  }
}
