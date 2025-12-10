// src/modules/course/infrastructure/controllers/category.controller.ts

import { logger } from '@/utils/logger';
import type { Request, Response } from 'express';
import { CategoryService } from '@/modules/course/application/service/category.service';
import { PrismaCategoryRepository } from '../../prisma/repository/category.prisma.repository';

export class CategoryController {
  private prismaRepo = new PrismaCategoryRepository();
  private categoryService = new CategoryService(this.prismaRepo);

  // ---------------- GET ALL ----------------
  async getAllCategories(req: Request, res: Response): Promise<Response> {
    const functionName = 'CategoryController.getAllCategories';
    
    try {
      logger.info('%s - Fetching all categories', functionName);
      const categories = await this.categoryService.getAllCategories();
      
      logger.info('%s - Retrieved %d categories', functionName, categories.length);
      return res.status(200).json(categories.map(cat => cat.toJSON()));
    } catch (err) {
      logger.error('%s - Failed to fetch categories: %o', functionName, err);
      return res.status(500).json({ 
        error: err instanceof Error ? err.message : 'Unexpected error' 
      });
    }
  }

  // ---------------- GET BY ID ----------------
  async getCategoryById(req: Request, res: Response): Promise<Response> {
    const functionName = 'CategoryController.getCategoryById';
    
    try {
      const { id } = req.params;
      
      if (!id || isNaN(Number(id))) {
        logger.warn('%s - Invalid category ID: %s', functionName, id);
        return res.status(400).json({ error: 'Valid category ID is required' });
      }
      
      logger.info('%s - Fetching category with ID: %s', functionName, id);
      const category = await this.categoryService.getCategoryById(Number(id));
      
      logger.info('%s - Retrieved category: %s', functionName, category.name);
      return res.status(200).json(category.toJSON());
    } catch (err) {
      if (err instanceof Error && err.message === 'Category not found') {
        logger.warn('%s - Category not found', functionName);
        return res.status(404).json({ error: 'Category not found' });
      }
      
      logger.error('%s - Failed to fetch category: %o', functionName, err);
      return res.status(500).json({ 
        error: err instanceof Error ? err.message : 'Unexpected error' 
      });
    }
  }

  // ---------------- CREATE ----------------
  async createCategory(req: Request, res: Response): Promise<Response> {
    const functionName = 'CategoryController.createCategory';
    
    try {
      const { name } = req.body;
      
      if (!name || typeof name !== 'string' || name.trim() === '') {
        logger.warn('%s - Invalid category name', functionName);
        return res.status(400).json({ error: 'Category name is required' });
      }
      
      logger.info('%s - Creating new category: %s', functionName, name);
      const newCategory = await this.categoryService.createCategory(name.trim());
      
      logger.info('%s - Category created successfully: %s', functionName, newCategory.uuid);
      return res.status(201).json(newCategory.toJSON());
    } catch (err) {
      if (err instanceof Error && err.message === 'Category with this name already exists') {
        logger.warn('%s - Category name already exists', functionName);
        return res.status(409).json({ error: 'Category with this name already exists' });
      }
      
      logger.error('%s - Failed to create category: %o', functionName, err);
      return res.status(500).json({ 
        error: err instanceof Error ? err.message : 'Unexpected error' 
      });
    }
  }

  // ---------------- UPDATE ----------------
  async updateCategory(req: Request, res: Response): Promise<Response> {
    const functionName = 'CategoryController.updateCategory';
    
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      if (!id || isNaN(Number(id))) {
        logger.warn('%s - Invalid category ID: %s', functionName, id);
        return res.status(400).json({ error: 'Valid category ID is required' });
      }
      
      if (!name || typeof name !== 'string' || name.trim() === '') {
        logger.warn('%s - Invalid category name', functionName);
        return res.status(400).json({ error: 'Category name is required' });
      }
      
      logger.info('%s - Updating category ID: %s with name: %s', functionName, id, name);
      const updatedCategory = await this.categoryService.updateCategory(Number(id), name.trim());
      if(!updatedCategory){
        return res.status(404).json({error:"Categoriyalar topilmadi"})
      }
      logger.info('%s - Category updated successfully: %s', functionName, updatedCategory.uuid);
      return res.status(200).json(updatedCategory.toJSON());
    } catch (err) {
      if (err instanceof Error && err.message === 'Category not found') {
        logger.warn('%s - Category not found', functionName);
        return res.status(404).json({ error: 'Category not found' });
      }
      
      if (err instanceof Error && err.message === 'Category with this name already exists') {
        logger.warn('%s - Category name already exists', functionName);
        return res.status(409).json({ error: 'Category with this name already exists' });
      }
      
      logger.error('%s - Failed to update category: %o', functionName, err);
      return res.status(500).json({ 
        error: err instanceof Error ? err.message : 'Unexpected error' 
      });
    }
  }

  // ---------------- DELETE ----------------
  async deleteCategory(req: Request, res: Response): Promise<Response> {
    const functionName = 'CategoryController.deleteCategory';
    
    try {
      const { id } = req.params;
      
      if (!id || isNaN(Number(id))) {
        logger.warn('%s - Invalid category ID: %s', functionName, id);
        return res.status(400).json({ error: 'Valid category ID is required' });
      }
      
      logger.info('%s - Deleting category ID: %s', functionName, id);
      const deleted = await this.categoryService.deleteCategory(Number(id));
      
      if (!deleted) {
        logger.warn('%s - Category not found for deletion', functionName);
        return res.status(404).json({ error: 'Category not found' });
      }
      
      logger.info('%s - Category deleted successfully: %s', functionName, id);
      return res.status(200).json({ 
        message: 'Category deleted successfully',
        id: Number(id)
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'Category not found') {
        logger.warn('%s - Category not found', functionName);
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // You can add more specific error handling here
      // For example, if category is being used by videos/playlists
      
      logger.error('%s - Failed to delete category: %o', functionName, err);
      return res.status(500).json({ 
        error: err instanceof Error ? err.message : 'Unexpected error' 
      });
    }
  }
}