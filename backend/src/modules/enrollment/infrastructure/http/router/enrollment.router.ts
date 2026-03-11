
import { Permission } from "@/shared/enums/UserPermission.enum";
import { requirePermission } from "@/shared/middlewares/rbac.middleware";
import { Router } from "express";
import { EnrollmentController } from "../controller/enrollment.controller";
import { createContainer } from "@/modules/enrollment/container/enrollment.container";

const router =  Router()
const {enrollmentService} = createContainer();
const enrollmentController = new EnrollmentController(enrollmentService);


router.post('/',requirePermission(Permission.CREATE), (req,res,next) => enrollmentController.createEnrollmentUserToPlaylist(req,res,next) )

router.get('/:user_uuid', requirePermission(Permission.MANAGE), (req,res,next) => enrollmentController.getEnrollments(req,res,next))



export {router as EnrollmentRouter}