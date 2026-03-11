// src/modules/course/infrastructure/prisma/repository/category.prisma.repository.ts

import { Category } from '@/modules/course/domain/entities/category.entity'
import type { ICategoryRepository } from '@/modules/course/domain/repository/category.repository'
import { prisma } from '@/shared/client'

export class PrismaCategoryRepository implements ICategoryRepository {
  private toDomain(prismaCategory: any): Category {
    return new Category(
      prismaCategory.uuid,
      prismaCategory.name,
      prismaCategory.createdAt,
      prismaCategory.updatedAt
    )
  }

  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return categories.map(category => this.toDomain(category))
  }

  async findByUUID(id: string): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { uuid: id },
    })

    return this.toDomain(category)
  }

  async findByIds(ids: string[]): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: { uuid: { in: ids } },
    })

    return categories.map(category => this.toDomain(category))
  }

  async findByName(name: string): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { name },
    })

    return this.toDomain(category)
  }

  async create(category: Category): Promise<Category> {
    const newCategory = await prisma.category.create({
      data: {
        uuid: category.id,
        name: category.nameValue,
        createdAt: category.createdAtValue,
        updatedAt: category.updatedAtValue
      },
    })

    return this.toDomain(newCategory)
  }

  async update(id: string, category: Category): Promise<Category> {

    
      const updatedCategory = await prisma.category.update({
        where: { uuid: id },
        data: {
          name: category.nameValue,
        },
      })

      return this.toDomain(updatedCategory)

  }

  async delete(id: string): Promise<boolean> {

      await prisma.category.delete({
        where: { uuid: id },
      })
      return true
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: { uuid: id },
    })

    return count > 0
  }
}
