import { PlaylistPrismaRepository } from "@/modules/course/infrastructure/prisma/repository/playlist.prisma.repository"
import { EnrollmentService } from "../application/service/enrollment.service"
import { PrismaEnrollmentRepository } from "../infrastructure/prisma/enrollment.prisma.repo"
import { PrismaUserRepository } from "@/modules/user/infrastructure/prisma/repositories/user.prisma.repository"

export function createContainer(){
        const enrollmentRepo = new PrismaEnrollmentRepository()
        const userRepo = new PrismaUserRepository()
        const playlistRepo = new PlaylistPrismaRepository()
      const enrollmentService = new EnrollmentService(enrollmentRepo, userRepo,playlistRepo)
const playlistRepository = new PlaylistPrismaRepository()
      return {
        enrollmentService,
        playlistRepository
      }
}