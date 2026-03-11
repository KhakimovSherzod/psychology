import type { ICartRepository } from "../../domain/repository/cart.repository";

export class RemoveCartItemUseCase{
    constructor(private cartRepo: ICartRepository ){}
    async execute(userId:string, playlistId:string){
        const cart = await this.cartRepo.findActiveByUser(userId)
        if(!cart) throw new Error("cart could not be found by user id in order to remove item")
        cart.removeItem(playlistId)

        await this.cartRepo.save(cart)
    }
}