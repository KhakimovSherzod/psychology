// src/modules/course/infrastructure/routes/category.routes.ts

import { CategoryPermission } from '@/shared/enums/CategoryPermission.enum'
import { requirePermission } from '@/shared/middlewares/rbac.middleware'
import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller'
import { Permission } from '@/shared/enums/UserPermission.enum'

const router = Router()
const categoryController = new CategoryController()

// GET all categories
router.get('/', requirePermission(Permission.READ), (req, res) =>
  categoryController.getAllCategories(req, res)
)

// GET category by ID
router.get('/:id', requirePermission(Permission.READ), (req, res) =>
  categoryController.getCategoryById(req, res)
)

// POST create new category
router.post('/', requirePermission(Permission.CREATE), (req, res) =>
  categoryController.createCategory(req, res)
)

// PATCH update category
router.patch('/:id', requirePermission(Permission.UPDATE), (req, res) =>
  categoryController.updateCategory(req, res)
)

// DELETE category
router.delete('/:id', requirePermission(Permission.DELETE), (req, res) =>
  categoryController.deleteCategory(req, res)
)

export { router as CategoryRoutes }
