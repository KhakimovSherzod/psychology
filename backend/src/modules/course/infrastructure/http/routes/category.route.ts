// src/modules/course/infrastructure/routes/category.routes.ts

import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller'

const router = Router()
const categoryController = new CategoryController()

// GET all categories
router.get('/', (req, res) => categoryController.getAllCategories(req, res))

// GET category by ID
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res))

// POST create new category
router.post('/', (req, res) => categoryController.createCategory(req, res))

// PATCH update category
router.patch('/:id', (req, res) => categoryController.updateCategory(req, res))

// DELETE category
router.delete('/:id', (req, res) => categoryController.deleteCategory(req, res))

export { router as CategoryRoutes }
