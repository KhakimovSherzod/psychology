import type { ICartRepository } from "../../domain/repository/cart.repository";
import type { GetCartResponseDto } from "../DTO/get.cart.response.dto";
import { CartMapper } from "../mappers/cart.mapper";

export class FindActiveCartByUserUseCase{
    constructor(private cartRepo: ICartRepository ){}

    async execute(userId:string):Promise<GetCartResponseDto> {
        const activeCart = await this.cartRepo.findActiveByUser(userId);
        if(activeCart === null) throw new Error("active cart should not be null")
        return CartMapper.toResponse(activeCart)
    }
}