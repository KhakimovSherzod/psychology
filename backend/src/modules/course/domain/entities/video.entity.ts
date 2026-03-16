import { CannotArchiveAlreadyArchivedVideo } from '@/shared/errors/domain/CannotArchiveAlreadyArchivedVideo'
import { CannotArchiveDraftVideo } from '@/shared/errors/domain/CannotArchiveDraftVideo'
import { CannotModifyDeletedVideoError } from '@/shared/errors/domain/CannotModifyDeletedVideo'
import { CannotPublishArchivedVideo } from '@/shared/errors/domain/CannotPublishArchivedVideoError'
import { CannotUnpublishNonPublishedVideo } from '@/shared/errors/domain/CannotUnpublishNonPublishedVideo'
import { VideoProvider, VideoStatus } from '@prisma/client'
import type { CategorySchema } from '../types/category.entity.schema'

export class Video {
  private constructor(
    private readonly uuid: string,
    private readonly provider: VideoProvider,
    private readonly externalVideoId: string,
    private title: string,
    private videoThumbnailUrl: string,
    private status: VideoStatus,
    private categories: CategorySchema[],
    private order: number,
    private isFree: boolean,
    private createdAt: Date,
    private description: string,
    private updatedAt: Date,
    private deletedAt?: Date,
    private publishedAt?: Date,
    private archivedAt?: Date,
    private internalId?:number
  ) {}

  static reconstruct(props: {
    uuid: string
    provider: VideoProvider
    externalVideoId: string
    title: string
    videoThumbnailUrl: string
    status: VideoStatus
    categories: CategorySchema[]
    order: number
    isFree: boolean
    internalId?: number
    createdAt: Date
    description: string
    updatedAt: Date
    deletedAt?: Date
    publishedAt?: Date
    archivedAt?: Date
  }): Video {
    return new Video(
      props.uuid,
      props.provider,
      props.externalVideoId,
      props.title,
      props.videoThumbnailUrl,
      props.status,
      props.categories,
      props.order,
      props.isFree,
      props.createdAt,
      props.description,
      props.updatedAt,
      props.deletedAt,
      props.publishedAt,
      props.archivedAt,
      props.internalId
    )
  }
  static create(props: {
    uuid: string
    provider: VideoProvider
    externalVideoId: string
    title: string
    videoThumbnailUrl: string
    status: VideoStatus
    categories: string[]
    isFree: boolean
    description: string
    order?: number
  }): Video {
    return new Video(
      props.uuid,
      props.provider,
      props.externalVideoId,
      props.title,
      props.videoThumbnailUrl,
      props.status,
      props.categories.map(c => ({ uuid: c, name: '' })),
      props.order ?? 0,
      props.isFree, 
      new Date(), 
      props.description,
      new Date() 
    )
  }
  // ------------ GETTERS ----------------

  get id(): string {
    return this.uuid
  }

  get providerValue(): VideoProvider {
    return this.provider
  }

  get externalId(): string {
    return this.externalVideoId
  }

  get titleValue(): string {
    return this.title
  }

  get videoThumbnailUrlValue(): string {
    return this.videoThumbnailUrl
  }

  get statusValue(): VideoStatus {
    return this.status
  }
   get internalIdValue(): number {
  if (!this.internalId) {
    throw new Error('User is not persisted yet. Internal ID not assigned.')
  }
  return this.internalId
}
  get categoriesValue(): CategorySchema[] {
    return this.categories
  }

  get orderValue(): number {
    return this.order
  }
  get createdAtValue() {
    return this.createdAt
  }


  get descriptionValue(): string {
    return this.description
  }

  get isFreeValue(): boolean {
    return this.isFree
  }

  get updatedAtValue(): Date | undefined {
    return this.updatedAt
  }

  get deletedAtValue(): Date | undefined {
    return this.deletedAt
  }

  get publishedAtValue(): Date | undefined {
    return this.publishedAt
  }

  get archivedAtValue(): Date | undefined {
    return this.archivedAt
  }
  // ------------- SETTERS / UPDATERS --------------

  set titleValue(newTitle: string) {
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error('Video title cannot be empty')
    }
    if (this.deletedAt) {
      throw new CannotModifyDeletedVideoError(this.uuid)
    }
    this.title = newTitle
    this.touchUpdatedAt()
  }
  set orderValue(newOrder: number) {
    this.order = newOrder
    this.touchUpdatedAt()
  }

  set videoThumbnailUrlValue(newUrl: string) {
    if (this.deletedAt) {
      throw new CannotModifyDeletedVideoError(this.uuid)
    }
    this.videoThumbnailUrl = newUrl
    this.touchUpdatedAt()
  }

  set descriptionValue(newDescription: string) {
    if (this.deletedAt) {
      throw new CannotModifyDeletedVideoError(this.uuid)
    }
    this.description = newDescription
    this.touchUpdatedAt()
  }

  set isFreeValue(free: boolean) {
    if (this.deletedAt) {
      throw new CannotModifyDeletedVideoError(this.uuid)
    }
    this.isFree = free
    this.touchUpdatedAt()
  }

  private touchUpdatedAt() {
    this.updatedAt = new Date()
  }

  /* ---------------------------
   * Status functions
   * --------------------------- */

  publish() {
    if (this.status === VideoStatus.ARCHIVED) throw new CannotPublishArchivedVideo(this.uuid)
    if (this.deletedAt) throw new CannotModifyDeletedVideoError(this.uuid)

    this.status = VideoStatus.PUBLISHED
    this.publishedAt = new Date()
    this.updatedAt = new Date()
  }

  archive() {
    if (this.status === VideoStatus.ARCHIVED) throw new CannotArchiveAlreadyArchivedVideo(this.uuid)
    if (this.status === VideoStatus.DRAFT) throw new CannotArchiveDraftVideo(this.uuid)
    if (this.deletedAt) throw new CannotModifyDeletedVideoError(this.uuid)

    this.status = VideoStatus.ARCHIVED
    this.archivedAt = new Date()
    this.updatedAt = new Date()
  }

  unpublish() {
    if (this.status !== VideoStatus.PUBLISHED) throw new CannotUnpublishNonPublishedVideo(this.uuid)
    if (this.deletedAt) throw new CannotModifyDeletedVideoError(this.uuid)

    this.status = VideoStatus.DRAFT
    this.publishedAt = undefined
    this.updatedAt = new Date()
  }

  /* ---------------------------
   * Categories
   * --------------------------- */
  addCategory(category: CategorySchema) {
    if (this.deletedAt) throw new CannotModifyDeletedVideoError(this.uuid)
    if (!this.hasCategory(category.uuid)) this.categories.push(category)
  }

  removeCategory(uuid: string) {
    if (this.deletedAt) throw new CannotModifyDeletedVideoError(this.uuid)
    this.categories = this.categories.filter(c => c.uuid !== uuid)
  }

  hasCategory(uuid: string): boolean {
    return this.categories.some(c => c.uuid === uuid)
  }

  /* ---------------------------
   * Description
   * --------------------------- */
  updateDescription(newDescription: string) {
    if (this.deletedAt) throw new CannotModifyDeletedVideoError(this.uuid)
    this.description = newDescription
    this.updatedAt = new Date()
  }

  /* ---------------------------
   * Deletion
   * --------------------------- */
  delete() {
    if (this.deletedAt) return
    this.deletedAt = new Date()
  }

  isDeleted(): boolean {
    return !!this.deletedAt
  }
  restore() {
    if (!this.deletedAt) {
      return
    }

    this.deletedAt = undefined
    this.updatedAt = new Date()
  }
}
