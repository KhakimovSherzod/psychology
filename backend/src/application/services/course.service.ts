import type { ICourseRepository } from '@/domain/repositories/course.repository'
import type { CreateCourseInput } from '@/infrastructure/prisma/interfaces/course.interface'
import axios from 'axios'

export class CourseService {
  constructor(private courseRepository: ICourseRepository) {}

  async getAllCourses() {
    return await this.courseRepository.getAllCourses()
  }

  async createCourse(courseData: CreateCourseInput) {
    courseData.publishedAt = courseData.status === 'PUBLISHED' ? new Date() : null

    courseData.playlistId =
      courseData.playlistId && courseData.playlistId !== 'none' ? courseData.playlistId : null

    return await this.courseRepository.createCourse(courseData)
  }

  async getAllCategories() {
    return await this.courseRepository.getCourseCategories()
  }

  async getAllPlaylists() {
    return await this.courseRepository.getCoursePlaylists()
  }

  async createNewCategories(data: { name: string; description: string }) {
    return await this.courseRepository.createNewCategories(data)
  }

  // ============================
  // SIGNED URL UPLOAD FLOW
  // ============================

  async createBunnyVideoEntry(): Promise<string> {
    const API_KEY = process.env.BUNNY_API_KEY
    const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID

    if (!API_KEY || !LIBRARY_ID) throw new Error('Bunny API not configured')

    const response = await axios.post(
      `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
      {}, // no file here — just creating entry
      {
        headers: {
          AccessKey: API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data.guid // videoId
  }

  async getSignedUploadUrl(videoId: string): Promise<string> {
    const API_KEY = process.env.BUNNY_API_KEY
    const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID

    if (!API_KEY || !LIBRARY_ID) {
      throw new Error('Bunny API key or Library ID not configured')
    }

    const response = await axios.post(
      `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}/upload`,
      {},
      {
        headers: {
          AccessKey: API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data.url // presigned URL
  }

  async generateSignedVideoUpload(): Promise<{ videoId: string; uploadUrl: string }> {
    // STEP 1: Create video entry (returns videoId)
    const videoId = await this.createBunnyVideoEntry()

    // STEP 2: Get signed URL to upload video
    const uploadUrl = await this.getSignedUploadUrl(videoId)

    return { videoId, uploadUrl }
  }
}
