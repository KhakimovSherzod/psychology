
import { uuidParamSchema } from '@/shared/validator/uuid.validator';
import type { Request,Response,NextFunction } from 'express-serve-static-core';
import { addToCartSchema } from '../../validator/add.cart.validator';
import type { AddToCartUseCase } from '@/modules/cart/application/use-cases/add.cart';
import type { FindActiveCartByUserUseCase } from '@/modules/cart/application/use-cases/findActiveCartByUser';
import type { RemoveCartItemUseCase } from '@/modules/cart/application/use-cases/remove.cart.item';
import type { ClearCartUseCase } from '@/modules/cart/application/use-cases/clear.cart';


export class CartController {
    constructor(
        private addToCartUseCase:AddToCartUseCase, 
        private findActiveCartByUserUseCase:FindActiveCartByUserUseCase, 
        private removeCartItemUseCase:RemoveCartItemUseCase,
        private clearCartUseCase:ClearCartUseCase){}

    async addToCart(req:Request, res:Response, next:NextFunction):Promise<void>{
        try{
            const userId = uuidParamSchema.parse(req.user.sub)
            const data = addToCartSchema.parse(req.body)
            await this.addToCartUseCase.execute(userId, data)
            res.status(201).end()
        }catch(err){
            next(err)
        }
    }
    async getCart(req:Request, res:Response, next:NextFunction):Promise<void>{
        try{
            const userId = uuidParamSchema.parse(req.user.sub)
            const cart = await this.findActiveCartByUserUseCase.execute(userId)
            res.status(200).json(cart)
        }catch(err){
            next(err)
        }
    }
    async removeCartItem(req:Request, res:Response, next:NextFunction):Promise<void>{
        try{
            // const playlistId = uuidParamSchema.parse(req.params.playlistId)
            const userId = uuidParamSchema.parse(req.user.sub)
            const playlistId = uuidParamSchema.parse(req.params.playlistId )
            await this.removeCartItemUseCase.execute(userId, playlistId)
            res.status(200).end()
        }catch(err){
            next(err)
        }
    }
    async clearCart(req:Request, res:Response, next:NextFunction){
        try{
            const userId = uuidParamSchema.parse(req.user.sub)
            await this.clearCartUseCase.execute(userId)
            res.status(200).end()
        }catch(err){
            next(err)
        }
    }
}