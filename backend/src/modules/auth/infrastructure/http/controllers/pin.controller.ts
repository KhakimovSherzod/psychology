// infrastructure/http/controllers/user.controller.ts

import { PinService } from '@/modules/auth/application/service/pin-user.service'
import { PrismaUserRepository } from '@/modules/user/infrastructure/prisma/repositories/user.prisma.repository'
import type { Request, Response } from 'express'

export class PinController {
  private userRepo = new PrismaUserRepository()
  private pinService = new PinService(this.userRepo)

  async verifyPin(req: Request, res: Response): Promise<Response> {
    try {
      const uuid = req.user?.sub
      const { pin } = req.body

      if (!uuid) {
        return res.status(400).json({ message: 'User UUID not found' })
      }

      if (!pin) {
        return res.status(400).json({ message: 'PIN not provided' })
      }

      const isValid = await this.pinService.verifyPin(uuid, pin)

      return res.status(200).json({ isValid })
    } catch (err: any) {
      console.error('Error occurred while verifying PIN:', err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  async changePin(req: Request, res: Response): Promise<Response> {
    try {
      const uuid = req.user?.sub
      const { newPin } = req.body

      if (!uuid) {
        return res.status(400).json({ message: 'User UUID not found' })
      }

      if (!newPin) {
        return res.status(400).json({ message: 'New PIN not provided' })
      }

      const result = await this.pinService.changePin(uuid, newPin)

      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message })
      }

      return res.status(200).json({ message: result.message })
    } catch (err: any) {
      console.error('Error occurred while changing PIN:', err)
      if (err?.status && err?.message) {
        return res.status(err.status).json({ message: err.message })
      }
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
