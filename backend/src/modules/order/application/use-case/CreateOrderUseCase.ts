
import { Order } from '../../domain/entity/order.entity'
import { OrderItem } from '../../domain/entity/order.item.entity'
import type { IOrderRepository } from '../../domain/repository/order.repository'

import { v4 as uuidv4 } from 'uuid'

interface CreateOrderItemDTO {
  playlistId: string
  price: number
  currency?: string
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository
  ) {}

  async execute(userId: string, items: CreateOrderItemDTO[]): Promise<Order> {

    // 1️⃣ Filter out duplicates by playlistId
    const seen = new Set<string>()
    const uniqueItems: CreateOrderItemDTO[] = []

    for (const item of items) {
      if (!seen.has(item.playlistId)) {
        seen.add(item.playlistId)
        uniqueItems.push(item)
      }
    }

    // 2️⃣ Create order items
    const orderItems = uniqueItems.map(item =>
      OrderItem.create(uuidv4(), item.playlistId, item.price, item.currency)
    )

    // 3️⃣ Create order
    const order = Order.create(uuidv4(), userId, orderItems)

    // 4️⃣ Persist order
    const createdOrder = await this.orderRepository.create(order)

    return createdOrder
  }
}