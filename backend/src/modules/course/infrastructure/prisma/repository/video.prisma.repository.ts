import { Video } from '@/modules/course/domain/entities/video.entity'
import type { IVideoRepository } from '@/modules/course/domain/repository/video.repository'
import { prisma } from '@/shared/client'
import { Prisma, VideoProvider, VideoStatus } from '@prisma/client'

export class VideoPrismaRepository implements IVideoRepository {
  /* ---------------------------------------------
   * Helpers
   * --------------------------------------------- */
  private async getPlaylistIdByUUID(uuid: string): Promise<number> {
    const playlist = await prisma.playlist.findUnique({
      where: { uuid },
      select: { id: true },
    })

    if (!playlist) {
      throw new Error(`Playlist ${uuid} not found`)
    }

    return playlist.id
  }

  /* ---------------------------------------------
   * Mapper: Prisma → Domain
   * --------------------------------------------- */
  private toDomain(record: any): Video {
    return Video.reconstruct({
      uuid: record.uuid,
      provider: record.provider as VideoProvider,
      externalVideoId: record.externalVideoId,
      title: record.title,
      videoThumbnailUrl: record.videoThumbnailUrl,
      status: record.status as VideoStatus,
      order: record.order,
      categories:
        record.categories?.map((c: any) => ({
          uuid: c.uuid,
          name: c.name,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          deletedAt: c.deletedAt ?? undefined,
        })) ?? [],
      createdAt: record.createdAt,
      description: record.description ?? undefined, // convert null -> undefined
      isFree: record.isFree ?? false,
      updatedAt: record.updatedAt ?? undefined,
      deletedAt: record.deletedAt ?? undefined,
      publishedAt: record.publishedAt ?? undefined,
      archivedAt: record.archivedAt ?? undefined,
    })
  }

  /* ---------------------------------------------
   * CREATE
   * --------------------------------------------- */
  async createVideo(video: Video, playlistId: string): Promise<Video> {
    const categories =
      video.categoriesValue.length > 0
        ? { connect: video.categoriesValue.map(c => ({ uuid: c.uuid })) }
        : undefined

    const data: Prisma.videoCreateInput = {
      uuid: video.id,
      provider: video.providerValue,
      externalVideoId: video.externalId,
      title: video.titleValue,
      videoThumbnailUrl: video.videoThumbnailUrlValue,
      status: video.statusValue,
      order: video.orderValue,
      playlist: { connect: { uuid: playlistId } },
      isFree: video.isFreeValue,
      description: video.descriptionValue ?? null,
      ...(categories ? { categories } : {}),
    }

    const record = await prisma.video.create({
      data,
      include: {
        playlist: { select: { uuid: true } },
        categories: { select: { uuid: true, name: true } },
      },
    })

    return this.toDomain(record)
  }

  /* ---------------------------------------------
   * GET ALL
   * --------------------------------------------- */
async getAllVideos(options?: {
  status?: VideoStatus | 'ALL'
  includeDeleted?: boolean
}): Promise<Video[]> {
  const {
    status = VideoStatus.PUBLISHED,
    includeDeleted = false,
  } = options ?? {}

  const where: Prisma.videoWhereInput = {}
  if (status !== 'ALL') where.status = status
  if (!includeDeleted) where.deletedAt = null

  const records = await prisma.video.findMany({
    where,
    orderBy: { order: 'asc' },
    include: {
      playlist: { select: { uuid: true } },
      categories: { select: { uuid: true, name: true } },
    },
  })

return records.map(r =>
  Video.reconstruct({
    uuid: r.uuid,
    provider: r.provider as VideoProvider,
    externalVideoId: r.externalVideoId,
    title: r.title,
    videoThumbnailUrl: r.videoThumbnailUrl,
    status: r.status as VideoStatus,
    order: r.order ?? 0,
    isFree: r.isFree ?? false,
    categories: r.categories?.map(c => ({ uuid: c.uuid, name: c.name })) ?? [],
    internalId: r.id,
    ...(r.createdAt && { createdAt: r.createdAt }),
    ...(r.description && { description: r.description }),
    ...(r.updatedAt && { updatedAt: r.updatedAt }),
    ...(r.deletedAt && { deletedAt: r.deletedAt }),
    ...(r.publishedAt && { publishedAt: r.publishedAt }),
    ...(r.archivedAt && { archivedAt: r.archivedAt }),
  })
)

}



  /* ---------------------------------------------
   * FIND BY UUID
   * --------------------------------------------- */
  async findByUUID(uuid: string): Promise<Video> {
    const record = await prisma.video.findUnique({
      where: { uuid },
      include: {
        playlist: { select: { uuid: true } },
        categories: { select: { uuid: true, name: true } },
      },
    })

    if (!record) {
      throw new Error(`Video ${uuid} not found`)
    }

    return this.toDomain(record)
  }



}
