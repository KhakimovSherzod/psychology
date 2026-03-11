
import { PrismaEnrollmentRepository } from '@/modules/enrollment/infrastructure/prisma/enrollment.prisma.repo'
import { PlaylistService } from '../application/service/playlist.service'
import { VideoService } from '../application/service/video.service'
import { YouTubeSyncService } from '../domain/service/youtubeSync.service'
import { BunnyStreamingProvider } from '../infrastructure/prisma/repository/bunny.streaming.provider'
import { PlaylistPrismaRepository } from '../infrastructure/prisma/repository/playlist.prisma.repository'
import { VideoPrismaRepository } from '../infrastructure/prisma/repository/video.prisma.repository'
import { EnrollmentService } from '@/modules/enrollment/application/service/enrollment.service'
import { PrismaUserRepository } from '@/modules/user/infrastructure/prisma/repositories/user.prisma.repository'

export function createContainer() {
  const videoRepo = new VideoPrismaRepository()
  const bunnyRepo = new BunnyStreamingProvider()
  const playlistRepo = new PlaylistPrismaRepository()
    const enrollmentRepo = new PrismaEnrollmentRepository()
    const userRepository = new PrismaUserRepository()
  const enrollmentService = new EnrollmentService(enrollmentRepo)
  const videoService = new VideoService(videoRepo, bunnyRepo)
  const youTubeSyncService = new YouTubeSyncService(playlistRepo, videoRepo)
  const playlistService = new PlaylistService(playlistRepo,enrollmentService, userRepository)
  return {
    videoService,
    youTubeSyncService,
    playlistService,
  }
}
