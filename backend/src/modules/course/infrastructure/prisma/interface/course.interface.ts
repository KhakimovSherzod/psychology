export interface CreateCourseInput {
  title: string
  description: string
  subtitles: string
  videoUrl: string
  thumbnailUrl: string
  categoryId: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  price: number
  status?: 'DRAFT' | 'UNLISTED' | 'PUBLISHED'
  playlistId?: string | null // attach to existing playlist
  newPlaylist?: {
    // create new playlist with this course
    title: string
    description: string
    playlistThumbnailUrl: string
  }
  order?: number | null
  publishedAt?: Date | null
}
