import { Course, Playlist } from '../../domain/entities/course.entity'

export interface ICourseRepository {
  getAllCourses(): Promise<Course[]>
  createCourse(data: any): Promise<Course>
  getCoursePlaylists(): Promise<Playlist[]>
}
