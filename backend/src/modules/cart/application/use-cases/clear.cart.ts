import type { ICartRepository } from "../../domain/repository/cart.repository";

export class ClearCartUseCase{
    constructor(private cartRepo:ICartRepository){}

    async execute(userId:string){
        const cart = await this.cartRepo.findActiveByUser(userId)
        if(!cart) throw new Error("this cart does not exist in this user id")
        cart.clear();
        await this.cartRepo.save(cart)
    }
}