import type { Cart } from "../entity/cart.entity"

export interface ICartRepository{
    findActiveByUser(userId:string):Promise<Cart | null>
    createActiveCart(userId:string):Promise<Cart>
    save(cart:Cart):Promise<void>
}