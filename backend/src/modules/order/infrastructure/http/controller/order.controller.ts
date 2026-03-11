import { GetOrderUseCase } from '../../../application/use-case/GetOrderUseCase';
// controller/order.controller.ts

import type { Request, Response } from "express";
import type { NextFunction } from "express-serve-static-core";
import {  CreateOrderSchema } from "../../validator/create.order.zod";
import type { CreateOrderUseCase } from "@/modules/order/application/use-case/CreateOrderUseCase";
import { uuidParamSchema } from "@/shared/validator/uuid.validator";
import type { GetUserOrdersUseCase } from '@/modules/order/application/use-case/GetUserOrdersUseCase';

export class OrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase,private getOrderUseCase:GetOrderUseCase, private getUserOrdersUseCase:GetUserOrdersUseCase) {}

  async createOrder(req: Request, res: Response, next:NextFunction):Promise<void> {
    try {
      const { userId, items } = CreateOrderSchema.parse(req.body);

      const order = await this.createOrderUseCase.execute(userId, items);

      res.status(201).json({ order });

    } catch (error) {
      next(error)
    }
  }
  async getOrder(req:Request, res:Response, next:NextFunction):Promise<void> {
    try{
      const orderId = uuidParamSchema.parse(req.params.uuid);

      const order = await this.getOrderUseCase.execute(orderId)

      res.status(200).json(order)
    }catch(err){
      next(err)
    }
  }

  async getUserOrders(req:Request, res:Response, next:NextFunction):Promise<void>{
    try{
      const userId = uuidParamSchema.parse(req.params.userId);
    const userOrders = await this.getUserOrdersUseCase.execute(userId)
    res.status(200).json(userOrders)
    }catch(err){
      next(err)
    }

  }
}