import type { Order } from "../../domain/entity/order.entity";
import type { GetOrderResponse } from "../DTO/GetOrderResponse.dto";
import type { GetUserOrdersResponse } from "../DTO/GetUserOrdersResponse.dto";

export class OrderMapper {
 static toDTO(order: Order): GetOrderResponse {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    currency: order.currency,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt!,
    ...(order.paidAt && { paidAt: order.paidAt }),

    items: order.items.map(item => ({
      id: item.id,
      playlistId: item.playlistId,
      price: item.price,
      currency: item.currency,
      createdAt: item.createdAt,
    })),
  }
}

 static toUserOrdersDTO(order: Order): GetUserOrdersResponse {
    return {
      id: order.id,
      status: order.status,
      currency: order.currency,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt!,
      ...(order.paidAt && { paidAt: order.paidAt }),
    }
  }
}