export interface VideoStreamingProvider{
    getPlaybackUrl(uuid: string): Promise<string>
}