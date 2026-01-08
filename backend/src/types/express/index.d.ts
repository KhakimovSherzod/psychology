import type { Role } from '@/modules/user/domain/value-objects/Role'

declare global {
  namespace Express {
    interface Request {
      user?: { sub: string; role: Role } | null
    }
  }
}
