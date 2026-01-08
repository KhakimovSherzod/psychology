import type { Permission } from '@/shared/enums/UserPermission.enum'
import type { UserRole } from '@/shared/enums/UserRole.enum'

export class Role {
  private readonly permissions: Set<Permission>

  constructor(public readonly name: UserRole, permissions: Permission[]) {
    this.permissions = new Set(permissions)
  }

  allows(permission: Permission): boolean {
    return this.permissions.has(permission)
  }
}
