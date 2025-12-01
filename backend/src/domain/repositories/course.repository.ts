import { Course, CourseCategories, Playlist } from '../entities/course.entity'

export interface ICourseRepository {
  getAllCourses(): Promise<Course[]>
  createCourse(data: any): Promise<Course>
  getCourseCategories(): Promise<CourseCategories[]>
  getCoursePlaylists(): Promise<Playlist[]>
  createNewCategories(data: {name:string, description:string}): Promise<CourseCategories>
}
