
import type { IOrderRepository } from "../../domain/repository/order.repository";
import type { GetUserOrdersResponse } from "../DTO/GetUserOrdersResponse.dto";
import { OrderMapper } from "../mappers/order.mapper";

export class GetUserOrdersUseCase {
   constructor(private orderRepo: IOrderRepository) {}
 async execute(userId: string): Promise<GetUserOrdersResponse[]> {
    const orders = await this.orderRepo.findByUserUUID(userId)
    return orders.map(OrderMapper.toUserOrdersDTO)
  }
}