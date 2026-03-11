import { createCartContainer } from '@/modules/cart/container/createcontainer';
import { CartController } from '../controller/cart.controller';
import { Permission } from "@/shared/enums/UserPermission.enum";
import { requirePermission } from "@/shared/middlewares/rbac.middleware";
import { Router } from "express";

const router = Router()

const {addToCartUseCase,findActiveCartByUserUseCase,removeCartItemUseCase,clearCartUseCase} =  createCartContainer()
const cartController = new CartController(addToCartUseCase, findActiveCartByUserUseCase,removeCartItemUseCase,clearCartUseCase)

router.get("/", requirePermission(Permission.READ), (req,res, next) => cartController.getCart(req,res,next))
router.post("/", requirePermission(Permission.WRITE), (req,res,next) => cartController.addToCart(req,res, next))
router.delete("/clear", requirePermission(Permission.WRITE), (req,res,next) => cartController.clearCart(req,res,next))
router.delete("/items/:playlistId", requirePermission(Permission.WRITE), (req,res,next) => cartController.removeCartItem(req,res,next))
router.post("/checkout", requirePermission(Permission.WRITE), (req,res,next) => res.status(200).json("checkout"))
export {router as cartRouter}