
import { Router } from "express";
import { OrderController } from "../controller/order.controller";

import { OrderContainer } from '@/modules/order/container/order.container';
import { requirePermission } from "@/shared/middlewares/rbac.middleware";
import { Permission } from "@/shared/enums/UserPermission.enum";

const { createOrderUseCase,getOrderUseCase, getUserOrdersUseCase } = OrderContainer()
const orderController = new OrderController(createOrderUseCase, getOrderUseCase, getUserOrdersUseCase);

const router = Router();

router.get("/:userId/orders", requirePermission(Permission.READ),(req,res,next) =>
  orderController.getUserOrders(req,res,next)
);

router.get("/:uuid", requirePermission(Permission.READ), (req,res,next) =>
  orderController.getOrder(req,res,next)
);

router.post("/", requirePermission(Permission.READ), (req,res,next) =>
  orderController.createOrder(req,res,next)
);
// router.post("/:uuid/cancel")
// router.post("/:uuid/pay")

export { router as orderRouter };