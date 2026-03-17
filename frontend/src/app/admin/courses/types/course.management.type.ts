export type CourseManagementProps = {
  playlists: Playlist[]
}

export type Playlist = {
  id: string
  title: string
  visibility: 'PUBLIC'
  status: 'PUBLISHED'
  price: number
  categories: Category[]
  description: string
  playlistThumbnailUrl: string
  createdAt: string
  updatedAt: string
}

export type Category = {
  uuid: string
  name: string
}
