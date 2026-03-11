

import {  PinUserService } from '@/modules/auth/application/service/pin-user.service'
import type { NextFunction, Request, Response } from 'express'
import { verifyPinSchema } from '../validator/verify.pin.validator';
import { PinValidatorSchema } from '../validator/pin.validator';

export class PinController {
constructor(private readonly pinUserService:PinUserService){}

  async verifyPin(req: Request, res: Response, next:NextFunction) {
    try {
      const { deviceId, pin } = verifyPinSchema.parse(req.body)

      const isValid = await this.pinUserService.verifyPin(deviceId, pin)

       res.status(200).json({ isValid })
    } catch (err) {
       next(err)
    }
  }

  async changePin(req: Request, res: Response, next:NextFunction) {
    try {
      const uuid = req.user?.sub
      const newPin = PinValidatorSchema.parse(req.body)

      if (!uuid) {
        return res.status(400).json({ message: 'User UUID not found' })
      }

      await this.pinUserService.changePin(uuid, newPin)

      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  //  async resetPin(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const { phone } = ResetPinPhoneSchema.parse({
  //     phone: req.body.phone,
  //   })
  //   logger.info(
  //     "POST reset PIN request received in controller in resetPin function for PHONE: %s",
  //     phone
  //   )

  //   try {
  //     await this.pinService.resetPinByPhone(phone)
  //     res.status(200).send()
  //     logger.info("POST /users/reset-pin successful for PHONE: %s", phone)
  //   } catch (err) {
  //     logger.error("POST /users/reset-pin failed for PHONE: %s with error: %o", phone, err)
  //     next(err)
  //   }
  // }
}
