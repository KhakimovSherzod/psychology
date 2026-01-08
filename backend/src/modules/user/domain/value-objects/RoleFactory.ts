// domain/user/RoleFactory.ts

import { Permission } from '@/shared/enums/UserPermission.enum'
import { UserRole } from '@/shared/enums/UserRole.enum'
import { Role } from './Role'

export class RoleFactory {
  static fromName(name: UserRole): Role {
    switch (name) {
      case UserRole.USER:
        return this.user()
      case UserRole.ADMIN:
        return this.admin()
      case UserRole.OWNER:
        return this.owner()
      default:
        throw new Error(`Unknown role: ${name}`)
    }
  }

  static user(): Role {
    return new Role(UserRole.USER, [Permission.READ, Permission.WRITE, Permission.CHECK])
  }

  static admin(): Role {
    return new Role(UserRole.ADMIN, [
      Permission.READ,
      Permission.WRITE,
      Permission.CHECK,
      Permission.MANAGE, // admin-specific
      Permission.CREATE, // admin-specific
      Permission.UPDATE, // admin-specific
      Permission.DELETE, // admin-specific
    ])
  }

  static owner(): Role {
    return new Role(UserRole.OWNER, [
      Permission.READ,
      Permission.WRITE, // inherited from user
      Permission.CHECK, // inherited from user
      Permission.MANAGE, // admin-specific
      Permission.CREATE, // admin-specific
      Permission.UPDATE, // admin-specific
      Permission.DELETE, // admin-specific
      Permission.OWN, // owner-specific
    ])
  }
}
