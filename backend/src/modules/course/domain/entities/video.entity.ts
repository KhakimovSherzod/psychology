export class Video {
  constructor(
    public readonly uuid: string,
    public title: string,
    public playbackUrl: string,
    public playlistId: string,
    public description?: string,
    public videoThumbnailUrl?: string,
    public order?: number,
    public categories?: { uuid: string; name: string }[]
  ) {}
}
