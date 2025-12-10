// src/modules/course/application/service/category.service.ts

import type { ICategoryRepository } from '../repository/category.repository'
import { Category } from '../../domain/entities/category.entity'

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async getAllCategories() {
    return await this.categoryRepository.findAll()
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findById(id)
    
    if (!category) {
      throw new Error('Category not found')
    }
    
    return category
  }

  async createCategory(name: string) {
    // Check if category with same name already exists
    const existingCategory = await this.categoryRepository.findByName(name)
    
    if (existingCategory) {
      throw new Error('Category with this name already exists')
    }
    
    // Create new category entity
    const category = Category.create(name)
    
    // Save to repository
    return await this.categoryRepository.create(category)
  }

  async updateCategory(id: number, name: string) {
    // Check if category exists
    const exists = await this.categoryRepository.exists(id)
    
    if (!exists) {
      throw new Error('Category not found')
    }
    
    // Check if new name is already taken by another category
    const existingWithName = await this.categoryRepository.findByName(name)
    
    if (existingWithName && existingWithName.id !== id) {
      throw new Error('Category with this name already exists')
    }
    
    // Get the current category
    const category = await this.getCategoryById(id)
    
    // Update the category
    category.rename(name)
    
    // Save changes
    return await this.categoryRepository.update(id, category)
  }

  async deleteCategory(id: number) {
    // Check if category exists
    const exists = await this.categoryRepository.exists(id)
    
    if (!exists) {
      throw new Error('Category not found')
    }
    
    // You might want to add additional checks here
    // For example, check if category is being used by videos or playlists
    // This depends on your business rules
    
    return await this.categoryRepository.delete(id)
  }
}