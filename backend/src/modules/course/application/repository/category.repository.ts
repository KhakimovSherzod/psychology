// src/modules/course/application/repository/category.repository.ts

import type { Category } from '../../domain/entities/category.entity'

export interface ICategoryRepository {
  findAll(): Promise<Category[]>
  findById(id: number): Promise<Category | null>
  findByName(name: string): Promise<Category | null>
  create(category: Category): Promise<Category>
  update(id: number, category: Category): Promise<Category | null>
  delete(id: number): Promise<boolean>
  exists(id: number): Promise<boolean>
}
