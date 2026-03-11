import type { IOrderRepository } from "../../domain/repository/order.repository"
import type { GetOrderResponse } from "../DTO/GetOrderResponse.dto"
import { OrderMapper } from "../mappers/order.mapper"

export class GetOrderUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  async execute(orderId: string): Promise<GetOrderResponse> {
    const order = await this.orderRepo.findByUUID(orderId)

    return OrderMapper.toDTO(order)
  }
}