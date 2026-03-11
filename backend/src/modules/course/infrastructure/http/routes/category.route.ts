// src/modules/course/infrastructure/routes/category.routes.ts


import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller'
import { Permission } from '@/shared/enums/UserPermission.enum'

const router = Router()
const categoryController = new CategoryController()

// GET all categories
router.get('/', requirePermission(Permission.READ), (req, res, next) =>
  categoryController.getAllCategories(req, res, next)
)

// GET category by ID
router.get('/:id', requirePermission(Permission.READ), (req, res, next) =>
  categoryController.getCategoryById(req, res, next)
)

// POST create new category
router.post('/', requirePermission(Permission.CREATE), (req, res, next) =>
  categoryController.createCategory(req, res, next)
)

// PATCH update category
router.patch('/:id', requirePermission(Permission.UPDATE), (req, res, next) =>
  categoryController.updateCategory(req, res, next)
)

// DELETE category
router.delete('/:id', requirePermission(Permission.DELETE), (req, res,next) =>
  categoryController.deleteCategory(req, res,next)
)

export { router as CategoryRoutes }
