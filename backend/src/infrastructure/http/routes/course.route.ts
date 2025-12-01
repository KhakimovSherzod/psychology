import { Router } from 'express'
import { CourseController } from '../controllers/course.controller'

const router = Router()
const courseController = new CourseController()

//courses routes
router.get('/all', (req, res) => courseController.getAllCourses(req, res))
router.post('/createNewCourse', (req, res) => courseController.createNewCourse(req, res))
router.get('/categories', (req, res) => courseController.getAllCategories(req, res))
router.get('/playlists', (req, res) => courseController.getAllPlaylists(req, res))
router.post('/categories/create', (req, res) => courseController.createNewCategories(req, res))

//video routes
// in your routes file
router.get('/video/signed-upload', (req, res) =>
  courseController.generateSignedVideoUpload(req, res)
)

export { router as protectedCoursesRoutes }
