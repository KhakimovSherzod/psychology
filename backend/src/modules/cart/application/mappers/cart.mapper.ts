import type { Cart } from "../../domain/entity/cart.entity";
import type { GetCartResponseDto } from "../DTO/get.cart.response.dto";

export class CartMapper {

  static toResponse(cart: Cart): GetCartResponseDto {
    return {
      uuid: cart.id,
      userId: cart.userId,
      status: cart.status,

      items: cart.items.map(item => ({
        uuid: item.id,
        playlistId: item.playlistId,
        price: item.price.amount
      })),

      totalPrice: cart.totalPrice()
    }
  }

}