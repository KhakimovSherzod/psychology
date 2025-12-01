import type { Request, Response } from 'express'
import { CourseService } from '../../../application/services/course.service'
import { PrismaCourseRepository } from '../../prisma/repositories/course.prisma.repository'
export class CourseController {
  private prismaRepos = new PrismaCourseRepository()
  private courseService = new CourseService(this.prismaRepos)

  async getAllCourses(req: Request, res: Response): Promise<Response> {
    try {
      const courses = await this.courseService.getAllCourses()
      return res.status(200).json(courses)
    } catch (error) {
      console.error('getAllCourses error:', error)
      return res.status(500).json({ error: 'Failed to fetch courses' })
    }
  }

  async createNewCourse(req: Request, res: Response): Promise<Response> {
    try {
      const courseData = req.body
      if (!courseData) {
        return res.status(400).json({ error: 'Invalid course data' })
      }

      const newCourse = await this.courseService.createCourse(courseData)
      return res.status(201).json(newCourse)
    } catch (error) {
      console.error('createNewCourse error:', error)
      return res.status(500).json({ error: 'Failed to create course' })
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<Response> {
    try {
      console.log('get all data request in getAllCategories function inside course.controller.ts')
      const categories = await this.courseService.getAllCategories()
      if (!categories) {
        return res.status(404).json({ error: 'kategoriyalar topilmadi' })
      }
      return res.status(200).json(categories)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: err ?? 'kutilmagan xatolik yuz berdi' })
    }
  }
  async getAllPlaylists(req: Request, res: Response): Promise<Response> {
    try {
      console.log('get all data request in getAllPlaylists function inside course.controller.ts')
      const playlists = await this.courseService.getAllPlaylists()
      if (!playlists) {
        return res.status(404).json({ error: 'playlists not found' })
      }
      return res.status(200).json(playlists)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: err ?? 'unexpected error occurred' })
    }
  }
  async createNewCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categoryData = req.body
      if (!categoryData) {
        return res.status(400).json({ error: 'Invalid category data' })
      }
      const newCategory = await this.courseService.createNewCategories(categoryData)
      return res.status(201).json(newCategory)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: err ?? 'unexpected error occurred' })
    }
  }
// Inside CourseController
async generateSignedVideoUpload(req: Request, res: Response): Promise<Response> {
  try {
    // Call the service method
    const result = await this.courseService.generateSignedVideoUpload()

    // Return videoId and uploadUrl to the client
    return res.status(200).json(result)
  } catch (error) {
    console.error('generateSignedVideoUpload error:', error)
    return res.status(500).json({ error: 'Failed to generate signed video upload URL' })
  }
}


}
