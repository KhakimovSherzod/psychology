import type { Request, Response, NextFunction } from "express";


import type { EnrollmentService } from "@/modules/enrollment/application/service/enrollment.service";
import { uuidParamSchema } from "@/shared/validator/uuid.validator";

export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService
  ) {}

  async createEnrollmentUserToPlaylist(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>{
    try {
      const { playlistUUID, userUUID, expiresAt} = req.body;

      await this.enrollmentService.createEnrollment({
        userUUID:userUUID,
        playlistUUID: playlistUUID,
        expiresAt: expiresAt, 
      });

      res.status(201).end();
    } catch (error) {
      next(error);
    }
  }
  async getEnrollments(req:Request, res:Response, next:NextFunction):Promise<void>{
    try{
      const userUUID = uuidParamSchema.parse(req.params.user_uuid)
      const enrollments = await this.enrollmentService.getEnrollments(userUUID)
      res.status(200).json(enrollments);
    }catch(err){
      next(err)
    }
  }
}
