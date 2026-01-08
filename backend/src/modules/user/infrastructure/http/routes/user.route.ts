import { Permission } from '@/shared/enums/UserPermission.enum'
import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'
import { UserController } from '../controllers/user.controller'

const router = Router()
const userController = new UserController()
//! -------------------   user routes  -------------------

router.get('/me', requirePermission(Permission.WRITE), (req, res) => userController.me(req, res)) //* Get current user
router.patch('/update', requirePermission(Permission.WRITE), (req, res, next) =>
  userController.update(req, res, next)
) //* Update user details
router.delete('/delete', requirePermission(Permission.WRITE), (req, res, next) =>
  userController.delete(req, res, next)
) //* Delete user account
//! -------------------   admin routes  -------------------
//* Get all users
router.get('/', requirePermission(Permission.MANAGE), (req, res, next) =>
  userController.getAllUsers(req, res, next)
)
//* Get user by UUID
router.get('/:uuid', requirePermission(Permission.MANAGE), (req, res, next) =>
  userController.getUserByUuid(req, res, next)
)
//* update user status by UUID
router.patch('/:uuid/status', requirePermission(Permission.MANAGE), (req, res, next) =>
  userController.updateUserStatus(req, res, next)
)
//* reassign user role by UUID
router.patch('/:uuid/role', requirePermission(Permission.MANAGE), (req, res, next) =>
  userController.updateUserRole(req, res, next)
)
router.post('/', requirePermission(Permission.CREATE),(req,res,next)=> userController.createUser(req,res,next))

export { router as protectedUserRoutes }
