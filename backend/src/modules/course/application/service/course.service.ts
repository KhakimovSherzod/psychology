import type { CreateCourseInput } from '../../infrastructure/prisma/interface/course.interface'
import type { ICourseRepository } from '../repository/course.repository'

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


  async getAllPlaylists() {
    return await this.courseRepository.getCoursePlaylists()
  }
}
