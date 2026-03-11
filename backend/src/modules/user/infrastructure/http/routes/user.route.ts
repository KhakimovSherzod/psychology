

import { Permission } from '@/shared/enums/UserPermission.enum'
import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { createUserContainer } from '@/modules/user/container/CreateUserContainer';

const router = Router()
const {userService, createUserByAdminService, updateUserService} = createUserContainer()
const userController = new UserController(userService, createUserByAdminService,updateUserService)
//! -------------------   user routes  -------------------

router.get('/me', requirePermission(Permission.WRITE), (req, res, next) => userController.me(req, res, next)) //* Get current user
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
//* create new user by admin
router.post('/', requirePermission(Permission.CREATE), (req, res, next) =>
  userController.createUser(req, res, next)
)

//* restore deleted account by admin
router.post('/:uuid/restore', requirePermission(Permission.MANAGE), (req, res, next) =>
  userController.restoreUser(req, res, next)
)
router.delete('/:uuid', (req, res, next) => userController.deleteUser(req, res, next))

router.patch('/:uuid', requirePermission(Permission.MANAGE), (req, res, next) =>
  userController.updateUser(req, res, next)
)
export { router as protectedUserRoutes }
