import  { EnrollmentStatus } from "@prisma/client";


export class Enrollment {
  private constructor(
    public readonly uuid: string,
    public readonly userId: string,
    public readonly playlistId: string,
    private _status: EnrollmentStatus,
    private _expiresAt: Date,
    public readonly orderId?: number,
    public readonly createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
    public readonly internalId?: number,
  ) {}


  static create(params: {
    uuid: string;
    userId: string;
    playlistId: string;
    expiresAt: Date;
    orderId?: number;
  }): Enrollment {

    if (params.expiresAt <= new Date()) {
      throw new Error("Expiration date must be in the future");
    }

    return new Enrollment(
      params.uuid,
      params.userId,
      params.playlistId,
      EnrollmentStatus.ACTIVE,
      params.expiresAt,
      params.orderId,
    );
  }

  // =====================================================
  // Reconstruct — for loading from database
  // =====================================================

  static reconstruct(params: {
    uuid: string;
    userId: string;
    playlistId: string;
    status: EnrollmentStatus;
    expiresAt: Date;
    orderId?: number;
    createdAt: Date;
    updatedAt: Date;
    id?: number;
  }): Enrollment {

    return new Enrollment(
      params.uuid,
      params.userId,
      params.playlistId,
      params.status,
      params.expiresAt,
      params.orderId,
      params.createdAt,
      params.updatedAt,
      params.id
    );
  }

  // =====================================================
  // Getters
  // =====================================================
  
  get status(): EnrollmentStatus {
    return this._status;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
  get internalIdValue():number
{
  if(!this.internalId){
    throw new Error("internal id topilmadi")
  }
  return this.internalId
}  // =====================================================
  // Business Rules
  // =====================================================

  /**
   * Returns true only if:
   * - status is ACTIVE
   * - not expired
   */
  hasAccess(): boolean {
    return (
      this._status === EnrollmentStatus.ACTIVE &&
      !this.isExpired()
    );
  }

  /**
   * Checks time-based expiration only.
   * Does NOT mutate state.
   */
  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  /**
   * Explicitly mark as expired.
   * Use from cron/job if needed.
   */
  markExpired(): void {
    if (this._status === EnrollmentStatus.EXPIRED) {
      return;
    }

    this._status = EnrollmentStatus.EXPIRED;
    this.touch();
  }

  /**
   * Admin revokes access manually.
   */
  revoke(): void {
    if (this._status === EnrollmentStatus.REVOKED) {
      throw new Error("Enrollment already revoked");
    }

    this._status = EnrollmentStatus.REVOKED;
    this.touch();
  }

  /**
   * Extend expiration (e.g. repurchase or bonus time)
   */
  extend(newExpiration: Date): void {
    if (newExpiration <= this._expiresAt) {
      throw new Error(
        "New expiration must be greater than current expiration"
      );
    }

    this._expiresAt = newExpiration;
    this._status = EnrollmentStatus.ACTIVE;
    this.touch();
  }

  // =====================================================
  // Internal
  // =====================================================

  private touch(): void {
    this._updatedAt = new Date();
  }
}
