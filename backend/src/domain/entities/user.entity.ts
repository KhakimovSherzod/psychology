export type Role = 'USER' | 'ADMIN' | 'OWNER'
export type SubscriptionType = 'FREE' | 'PREMIUM'

export class User {
  constructor(
    public readonly uuid: string,
    public name: string,
    public phone: string,
    public pin: string,
    public verified: boolean,
    public deviceId: string[] = [],
    public readonly id?: number,
    public role?: Role,
    public subscriptionType?: SubscriptionType,
    public subscriptionValidTill?: Date | null,
    public profileImage?: string | null,
    public createdAt?: Date,
    public lastLogin?: Date | null
  ) {}
}
