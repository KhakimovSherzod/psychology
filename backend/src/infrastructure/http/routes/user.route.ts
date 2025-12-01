import { Router } from 'express'
import { CourseController } from '../controllers/course.controller'
import { UserController } from '../controllers/user.controller'

const router = Router()
const userController = new UserController()
const courseController = new CourseController()
// user routes
router.get('/me', (req, res) => userController.me(req, res))
router.patch('/update', (req, res) => userController.update(req, res))
router.delete('/delete', (req, res) => userController.delete(req, res))
router.post('/verify-pin', (req, res) => userController.verifyPin(req, res))
router.patch('/update/pin', (req, res) => userController.changePin(req, res))

//courses routes
router.get('/courses/all', (req, res) => courseController.getAllCourses(req, res))
router.post('/courses/createNewCourse', (req, res) => courseController.createNewCourse(req, res))
export { router as protectedUserRoutes }
