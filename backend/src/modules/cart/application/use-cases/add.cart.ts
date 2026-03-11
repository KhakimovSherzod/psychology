import type { IPlaylistRespository } from "@/modules/course/domain/repository/playlist.repository";
import type { ICartRepository } from "../../domain/repository/cart.repository";
import type { AddToCartDTO } from "../../infrastructure/validator/add.cart.validator";

export class AddToCartUseCase{
    constructor(private cartRepo: ICartRepository, private playlistRepo: IPlaylistRespository){}

async execute(userId: string, data:AddToCartDTO) {
  
  // 1️⃣ Find active cart
  let cart = await this.cartRepo.findActiveByUser(userId);
  console.log("cart",cart)
  // 2️⃣ If not exists → create
  if (!cart) {
    cart = await this.cartRepo.createActiveCart(userId);
  }
  

  const playlist = await this.playlistRepo.findByUUID(data.playlistId)
  if(playlist.priceValue.amount === null) return
  console.log(playlist)

  cart.addItem(data.playlistId, playlist.priceValue.amount);
  // console.log(userId)
  // console.log(cart.items)
  // // 4️⃣ Save
  await this.cartRepo.save(cart);
}
}