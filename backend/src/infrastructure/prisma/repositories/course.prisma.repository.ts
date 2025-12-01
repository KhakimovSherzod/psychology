import { Course, CourseCategories, Playlist } from '@/domain/entities/course.entity'
import type { ICourseRepository } from '@/domain/repositories/course.repository'
import { prisma } from '../client'
import type { CreateCourseInput } from '../interfaces/course.interface'

export class PrismaCourseRepository implements ICourseRepository {
  async getAllCourses(): Promise<Course[]> {
    const records = await prisma.course.findMany()

    return records.map(
      record =>
        new Course(
          record.id,
          record.title,
          record.description,
          record.subtitles,
          record.videoUrl,
          record.thumbnailUrl,
          record.categoryId,
          record.level,
          record.price,
          record.createdAt,
          record.updatedAt,
          record.status,
          record.publishedAt,
          record.playlistId,
          record.order
        )
    )
  }

  async createCourse(courseData: CreateCourseInput): Promise<Course> {
    let playlistId = courseData.playlistId ?? null
    console.log('courseData', courseData)
    if (courseData.newPlaylist) {
      const newPlaylist = await prisma.playlist.create({
        data: {
          title: courseData.newPlaylist.title,
          description: courseData.newPlaylist.description,
          playlistThumbnailUrl: courseData.newPlaylist.playlistThumbnailUrl,
        },
      })
      playlistId = newPlaylist.id
    }

    // 2️⃣ Create course
    const record = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        subtitles: courseData.subtitles,
        videoUrl: courseData.videoUrl,
        thumbnailUrl: courseData.thumbnailUrl,
        categoryId: courseData.categoryId,
        level: courseData.level,
        price: courseData.price,
        status: courseData.status ?? 'DRAFT',
        playlistId: playlistId,
        order: courseData.order ?? null,
        publishedAt: courseData.publishedAt ?? null,
      },
    })

    return new Course(
      record.id,
      record.title,
      record.description,
      record.subtitles,
      record.videoUrl,
      record.thumbnailUrl,
      record.categoryId,
      record.level,
      record.price,
      record.createdAt,
      record.updatedAt,
      record.status,
      record.publishedAt,
      record.playlistId,
      record.order
    )
  }
  // Get categories
  async getCourseCategories(): Promise<CourseCategories[]> {
    const categories = await prisma.courseCategory.findMany()

    return categories.map(
      category => new CourseCategories(category.id, category.name, category.description)
    )
  }

  // Get playlists
  async getCoursePlaylists(): Promise<Playlist[]> {
    const playlists = await prisma.playlist.findMany()

    return playlists.map(
      playlist =>
        new Playlist(
          playlist.id,
          playlist.title,
          playlist.description,
          playlist.playlistThumbnailUrl,
          playlist.createdAt,
          playlist.updatedAt
        )
    )
  }
  // Create new category
  async createNewCategories(data: {
    name: string
    description: string
  }): Promise<CourseCategories> {
    const newCategory = await prisma.courseCategory.create({
      data: {
        name: data.name,
        description: data.description,
      },
    })
    return new CourseCategories(newCategory.id, newCategory.name, newCategory.description)
  }
}
