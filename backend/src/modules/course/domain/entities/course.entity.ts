export class Course {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public subtitles: string | null,
    public videoUrl: string | null,
    public thumbnailUrl: string | null,
    public categoryId: string,
    public level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    public price: number | null,
    public createdAt: Date,
    public updatedAt: Date | null,
    public status: 'DRAFT' | 'UNLISTED' | 'PUBLISHED',
    public publishedAt: Date | null,
    public playlistId?: string | null,
    public order?: number | null
  ) {}
}

export class Playlist {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public playlistThumbnailUrl: string,
    public createdAt: Date,
    public updatedAt: Date,
    public courses?: Course[]
  ) {}
}

