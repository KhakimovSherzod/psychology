// src/modules/course/application/service/category.service.ts

import { Category } from '../../domain/entities/category.entity'
import type { ICategoryRepository } from '../../domain/repository/category.repository'

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async getAllCategories() {
    return await this.categoryRepository.findAll()
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findByUUID(id)

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
    const uuid = crypto.randomUUID()
    // Create new category entity
    const category = Category.create(uuid, name)

    // Save to repository
    return await this.categoryRepository.create(category)
  }

  async updateCategory(id: string, name: string) {

    // Get the current category
    const category = await this.getCategoryById(id)

    // Update the category
    category.rename(name)

    // Save changes
    return await this.categoryRepository.update(id, category)
  }

  async deleteCategory(id: string) {
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
