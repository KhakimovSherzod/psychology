// src/modules/course/application/repository/category.repository.ts

import type { Category } from '../../domain/entities/category.entity'

export interface ICategoryRepository {
  findAll(): Promise<Category[]>
  findByUUID(id: string): Promise<Category>
  findByIds(ids: string[]): Promise<Category[]>
  findByName(name: string): Promise<Category | null>
  create(category: Category): Promise<Category>
  update(id: string, category: Category): Promise<Category>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
