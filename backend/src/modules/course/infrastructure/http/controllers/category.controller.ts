// src/modules/course/infrastructure/controllers/category.controller.ts

import { CategoryService } from '@/modules/course/application/service/category.service'
import { logger } from '@/utils/logger'
import type { Request, Response } from 'express'
import { PrismaCategoryRepository } from '../../prisma/repository/category.prisma.repository'
import type { NextFunction } from 'express-serve-static-core'
import { uuidParamSchema } from '@/shared/validator/uuid.validator'

export class CategoryController {
  private prismaRepo = new PrismaCategoryRepository()
  private categoryService = new CategoryService(this.prismaRepo)

  // ---------------- GET ALL ----------------
  async getAllCategories(_req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories()

      res.status(200).json(categories)
    } catch (err) {
      next(err)
    }
  }

  // ---------------- GET BY ID ----------------
  async getCategoryById(req: Request, res: Response, next:NextFunction): Promise<void> {
    

    try {
      const id = uuidParamSchema.parse(req.params.id)
      const category = await this.categoryService.getCategoryById(id)

      res.status(200).json(category)
    } catch (err) {
      next(err)
    }
  }

  // ---------------- CREATE ----------------
  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const  {name}  = req.body

      const newCategory = await this.categoryService.createCategory(name)

       res.status(201).json(newCategory)
    } catch (err) {
      next(err)
    }
  }

  // ---------------- UPDATE ----------------
  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {


    try {
      const id  = uuidParamSchema.parse(req.params.id)
      const { name } = req.body
      await this.categoryService.updateCategory(id, name.trim())

       res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  // ---------------- DELETE ----------------
  async deleteCategory(req: Request, res: Response,next:NextFunction): Promise<void> {


    try {
      const id  = uuidParamSchema.parse(req.params.id)

      await this.categoryService.deleteCategory(id)
       res.status(200).end()
    } catch (err) {
      next(err)


    }
  }
}
