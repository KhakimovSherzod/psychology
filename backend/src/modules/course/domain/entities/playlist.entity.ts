import { CannotArchiveAlreadyArchivedVideo } from '@/shared/errors/domain/CannotArchiveAlreadyArchivedVideo'
import { CannotArchiveDraftVideo } from '@/shared/errors/domain/CannotArchiveDraftVideo'
import { CannotModifyDeletedVideoError } from '@/shared/errors/domain/CannotModifyDeletedVideo'
import { CannotPublishArchivedVideo } from '@/shared/errors/domain/CannotPublishArchivedVideoError'
import { CannotUnpublishNonPublishedVideo } from '@/shared/errors/domain/CannotUnpublishNonPublishedVideo'
import { PlaylistStatus, Visibility } from '@prisma/client'

import { PlaylistDeletedError } from '@/shared/errors/domain/PlaylistDeleted'
import { PlaylistNotPublishedError } from '@/shared/errors/domain/PlaylistNotPublishedError'
import { PlaylistNotPublicError } from '@/shared/errors/domain/PlaylistNotPublishedError '
import type { CategorySchema } from '../types/category.entity.schema'
import { PriceVO } from '../vo/price.vo'
import type { Video } from './video.entity'

export class Playlist {
  constructor(
    private readonly uuid: string,
    private title: string,
    private visibility: Visibility,
    private status: PlaylistStatus,
    private categories: CategorySchema[],
    private price: PriceVO,
    private playlistThumbnailUrl: string,
    private createdAt: Date,
    private updatedAt: Date,
    private description: string,
    private deletedAt?: Date,
    private publishedAt?: Date,
    private archivedAt?: Date,
    private videos: Video[] = [],
    private internalId?:number
  ) {
    this.validateTitle(title)
  }
  static reconstruct(
    params:{
    uuid: string,
    title: string,
    visibility: Visibility,
    status: PlaylistStatus,
    categories: CategorySchema[],
    price: number,
    playlistThumbnailUrl: string,
    createdAt: Date,
    updatedAt: Date,
    description: string,
    internalId?:number,
    deletedAt?: Date,
    publishedAt?: Date,
    archivedAt?: Date,
    videos?: Video[]
    }
  ): Playlist {
    return new Playlist(
      params.uuid,
      params.title,
      params.visibility,
      params.status,
      params.categories,
       new PriceVO(params.price),
      params.playlistThumbnailUrl,
      params.createdAt,
      params.updatedAt,
      params.description,
      params.deletedAt,
      params.publishedAt,
      params.archivedAt,
      params.videos,
      params.internalId
    )
  }

  ///GETTERS
  get id(): string {
    return this.uuid
  }
  get titleValue(): string {
    return this.title
  }
  get visibilityValue() {
    return this.visibility
  }
  get statusValue() {
    return this.status
  }
  get priceValue(): PriceVO {
    return this.price
  }
   get internalIdValue(): number {
  if (!this.internalId) {
    throw new Error('User is not persisted yet. Internal ID not assigned.')
  }
  return this.internalId
}
  get descriptionValue() {
    return this.description
  }
  get playlistThumbnailUrlValue() {
    return this.playlistThumbnailUrl
  }
  get createdAtValue() {
    return this.createdAt
  }
  get updatedAtValue() {
    return this.updatedAt
  }
  get deletedAtValue() {
    return this.deletedAt
  }
  get publishedAtValue() {
    return this.publishedAt
  }
  get archivedAtValue() {
    return this.archivedAt
  }
  get categoriesValue(): CategorySchema[] {
    return this.categories
  }
  get videosValue(): Video[] {
    return this.videos
  }

  // ----------------- VALIDATIONS -----------------
  private validateTitle(title: string) {
    if (!title || title.trim().length === 0) {
      throw new Error('Playlist title cannot be empty')
    }
  }

  // ----------------- STATUS -----------------
  publish() {
    if (this.status === PlaylistStatus.ARCHIVED) throw new CannotPublishArchivedVideo(this.uuid)

    this.status = PlaylistStatus.PUBLISHED
    this.publishedAt = new Date()
    this.touchUpdatedAt()
  }

  archive() {
    if (this.status === PlaylistStatus.DRAFT) throw new CannotArchiveDraftVideo(this.uuid)
    if (this.status === PlaylistStatus.ARCHIVED)
      throw new CannotArchiveAlreadyArchivedVideo(this.uuid)
    this.status = PlaylistStatus.ARCHIVED
    this.archivedAt = new Date()
    this.touchUpdatedAt()
  }

  unpublish() {
    if (this.status !== PlaylistStatus.PUBLISHED)
      throw new CannotUnpublishNonPublishedVideo(this.uuid)
    this.status = PlaylistStatus.DRAFT
    this.publishedAt = undefined
    this.touchUpdatedAt()
  }

  // ----------------- VISIBILITY -----------------
  setVisibility(visibility: Visibility) {
    this.visibility = visibility
    this.touchUpdatedAt()
  }

  isPublic() {
    return this.visibility === Visibility.PUBLIC
  }

  isPrivate() {
    return this.visibility === Visibility.PRIVATE
  }

  isUnlisted() {
    return this.visibility === Visibility.UNLISTED
  }

  ensureVisibleToUser() {
    if (this.isDeleted()) {
      throw new PlaylistDeletedError()
    }
    if (!this.isPublic()) {
      throw new PlaylistNotPublicError()
    }
    if (!this.isPublished()) {
      throw new PlaylistNotPublishedError()
    }
  }

  // ----------------- VIDEOS -----------------
addVideo(video: Video) {
  
  // Determine desired order
  let desiredOrder = video.orderValue && video.orderValue > 0 ? video.orderValue : undefined;

  // Remove any existing video with the same UUID (update scenario)
  this.videos = this.videos.filter(v => v.id !== video.id);

  if (!desiredOrder) {
    // Append at the end
    const maxOrder = this.videos.reduce((max, v) => Math.max(max, v.orderValue ?? 0), 0);
    video.orderValue = maxOrder + 1;
  } else {
    // Shift existing videos to make room for the new one
    this.videos
      .filter(v => !v.deletedAtValue && v.orderValue >= desiredOrder) // skip deleted videos
      .sort((a, b) => b.orderValue - a.orderValue) // largest to smallest
      .forEach(v => {
        v.orderValue += 1;
      });
    video.orderValue = desiredOrder;
  }

  this.videos.push(video);

  // Keep videos sorted by order
  this.videos.sort((a, b) => a.orderValue - b.orderValue);
}



  removeVideo(videoId: string) {
    const index = this.videos.findIndex(v => v.id === videoId)
    if (index === -1) {
      throw new Error('Video not found')
    }

    // Remove the video safely
    const [removedVideo] = this.videos.splice(index, 1)
    if (!removedVideo) {
      throw new Error('Failed to remove video')
    }

    // Adjust order for all videos with order greater than the removed video
    this.videos.forEach(v => {
      if (v.orderValue > removedVideo.orderValue) {
        v.orderValue -= 1
      }
    })

    // Optional: ensure array is sorted
    this.videos.sort((a, b) => a.orderValue - b.orderValue)

    this.touchUpdatedAt()
  }

  // ----------------- CATEGORIES -----------------
  addCategory(category: CategorySchema) {
    if (!this.categories.find(c => c.uuid === category.uuid)) {
      this.categories.push(category)
      this.touchUpdatedAt()
    }
  }

  removeCategory(categoryId: string) {
    this.categories = this.categories.filter(c => c.uuid !== categoryId)
    this.touchUpdatedAt()
  }

  hasCategory(categoryId: string): boolean {
    return this.categories.some(c => c.uuid === categoryId)
  }

  // ----------------- DESCRIPTION -----------------
  updateDescription(description: string) {
    if (this.deletedAt) throw new CannotModifyDeletedVideoError(this.uuid)
    this.description = description
    this.touchUpdatedAt()
  }

  // ----------------- PRICE -----------------
  setPrice(newPrice: PriceVO) {
    if (this.deletedAt) throw new CannotModifyDeletedVideoError(this.uuid)
    this.price = newPrice
    this.touchUpdatedAt()
  }
  // ----------------- SOFT DELETE -----------------
  delete() {
    if (!this.deletedAt) {
      this.deletedAt = new Date()
    }
  }

  restore() {
    if (this.deletedAt) {
      this.deletedAt = undefined
      this.touchUpdatedAt()
    }
  }

  isDeleted(): boolean {
    return !!this.deletedAt
  }

  // ----------------- VIDEOS STATUS HELPERS -----------------

  publishVideo(videoId: string) {
    const video = this.videos.find(v => v.id === videoId)
    if (!video) throw new Error('Video not found')
    if (this.status === PlaylistStatus.ARCHIVED)
      throw new Error('Cannot publish videos in an archived playlist')

    video.publish() // video handles its own status
    this.touchUpdatedAt()
  }

  archiveVideo(videoId: string) {
    const video = this.videos.find(v => v.id === videoId)
    if (!video) throw new Error('Video not found')
    if (this.status === PlaylistStatus.ARCHIVED)
      throw new Error('Cannot archive videos in an archived playlist')

    video.archive()
    this.touchUpdatedAt()
  }

  unpublishVideo(videoId: string) {
    const video = this.videos.find(v => v.id === videoId)
    if (!video) throw new Error('Video not found')

    video.unpublish()
    this.touchUpdatedAt()
  }

  private touchUpdatedAt() {
    this.updatedAt = new Date()
  }
  isPublished(): boolean {
    return this.statusValue === PlaylistStatus.PUBLISHED
  }
}
