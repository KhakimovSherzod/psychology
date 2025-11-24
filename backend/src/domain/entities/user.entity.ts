export type Role = 'USER' | 'ADMIN' | 'OWNER'

export class User {
  constructor(
    public readonly uuid: string,
    public name: string,
    public phone: string,
    public pin: string,
    public deviceId: string[] = [],
    public readonly id?: number,
    public role?: Role,
    public profileImage?: string | null,
    public createdAt?: Date,
    public lastLogin?: Date | null
  ) {}
}
