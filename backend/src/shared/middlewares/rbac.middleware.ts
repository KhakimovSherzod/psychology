import { Permission } from '@/shared/enums/UserPermission.enum'
import type { NextFunction, Request, Response } from 'express'

export const requirePermission =
  (permission: Permission) => async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    if (!req.user.role.allows(permission)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    next()
  }
