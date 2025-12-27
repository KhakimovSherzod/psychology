// src/modules/course/infrastructure/prisma/repository/category.prisma.repository.ts

import type { ICategoryRepository } from '@/modules/course/application/repository/category.repository'
import { Category } from '@/modules/course/domain/entities/category.entity'
import { prisma } from '@/shared/client'
import type { Category as PrismaCategory } from '@prisma/client'

export class PrismaCategoryRepository implements ICategoryRepository {
  private toDomain(prismaCategory: PrismaCategory): Category {
    return new Category(
      prismaCategory.id,
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

  async findById(id: number): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    return category ? this.toDomain(category) : null
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { name },
    })

    return category ? this.toDomain(category) : null
  }

  async create(category: Category): Promise<Category> {
    const newCategory = await prisma.category.create({
      data: {
        name: category.name,
      },
    })

    return this.toDomain(newCategory)
  }

  async update(id: number, category: Category): Promise<Category | null> {
    try {
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          name: category.name,
        },
      })

      return this.toDomain(updatedCategory)
    } catch (error) {
      // Handle case where category doesn't exist
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return null
      }
      throw error
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.category.delete({
        where: { id },
      })
      return true
    } catch (error) {
      // Handle case where category doesn't exist
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        return false
      }
      throw error
    }
  }

  async exists(id: number): Promise<boolean> {
    const count = await prisma.category.count({
      where: { id },
    })

    return count > 0
  }
}
