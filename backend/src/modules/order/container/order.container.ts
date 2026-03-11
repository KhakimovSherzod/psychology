import { GetOrderUseCase } from '../application/use-case/GetOrderUseCase';
import { PrismaOrderRepository } from "../infrastructure/prisma/order.prisma.repository";
import { CreateOrderUseCase } from "../application/use-case/CreateOrderUseCase";
import { GetUserOrdersUseCase } from '../application/use-case/GetUserOrdersUseCase';


export function OrderContainer(){
    const orderRepository = new PrismaOrderRepository();
    const createOrderUseCase = new CreateOrderUseCase(orderRepository);
    const getOrderUseCase = new GetOrderUseCase(orderRepository)
    const getUserOrdersUseCase = new GetUserOrdersUseCase(orderRepository)
    return {
        createOrderUseCase,
        getOrderUseCase,
        getUserOrdersUseCase
    }
}