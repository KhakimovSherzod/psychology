export interface AdminEnrollmentResponse {
  uuid: string;
  userId: string;        // UUID of user (not internalId)
  playlistId: string;    // UUID of playlist (not internalId)
  status: string;
  expiresAt: Date;
  paymentId?: number;
  createdAt: Date;
  updatedAt: Date;
  hasAccess: boolean;
  isExpired: boolean;
}