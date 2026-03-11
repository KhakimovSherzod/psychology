import type { Order } from "../entity/order.entity"

export interface IOrderRepository {
  findByUUID(orderId: string): Promise<Order>
  findByUserUUID(userId: string): Promise<Order[]>   
  create(order: Order): Promise<Order>
}