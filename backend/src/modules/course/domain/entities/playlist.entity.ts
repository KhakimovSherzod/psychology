export class Playlist {
  constructor(
    public readonly uuid: string,
    public title: string,
    public description?: string,
    public playlistThumbnailUrl?: string
  ) {}
}
