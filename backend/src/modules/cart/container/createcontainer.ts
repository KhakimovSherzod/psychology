import { ClearCartUseCase } from './../application/use-cases/clear.cart';

import { PlaylistPrismaRepository } from '@/modules/course/infrastructure/prisma/repository/playlist.prisma.repository';
import { AddToCartUseCase } from '../application/use-cases/add.cart';
import { CartPrismaRepository } from '../infrastructure/prisma/cart.prisma.repository';
import { FindActiveCartByUserUseCase } from '../application/use-cases/findActiveCartByUser';
import { RemoveCartItemUseCase } from '../application/use-cases/remove.cart.item';

export function createCartContainer(){
    const cartRepo = new CartPrismaRepository()
    const playlistPrismaRepository = new PlaylistPrismaRepository()
    
    const addToCartUseCase = new AddToCartUseCase(cartRepo, playlistPrismaRepository);
    const findActiveCartByUserUseCase = new FindActiveCartByUserUseCase(cartRepo)
    const removeCartItemUseCase = new RemoveCartItemUseCase(cartRepo)
    const clearCartUseCase = new ClearCartUseCase(cartRepo)
    return {
        addToCartUseCase,
        findActiveCartByUserUseCase,
        removeCartItemUseCase,
        clearCartUseCase
    }

}