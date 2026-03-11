
import type { UserRole } from '@/shared/enums/UserRole.enum'

export interface IAccessTokenPayload {
  userId: string
  role: UserRole
}

export interface IRefreshTokenPayload {
  userId: string
}

export interface IDeviceTokenPayload {
  deviceId: string
  userId: string
}

export interface IGenerateTokens {
  userId: string
  role: UserRole
  deviceId: string
}

export interface ITokens {
  accessToken: string
  refreshToken: string
  deviceToken: string
}

export interface ITokenService {
  generateAccessToken(payload: IAccessTokenPayload): Promise<string>
  generateRefreshToken(payload: IRefreshTokenPayload): Promise<string>
  generateDeviceToken(payload: IDeviceTokenPayload): Promise<string>
  generateTokens(payload: IGenerateTokens): Promise<ITokens>
  verifyAccessToken(token: string): IAccessTokenPayload | null
  verifyRefreshToken(token: string): IRefreshTokenPayload | null
  verifyDeviceToken(token: string): IDeviceTokenPayload | null
}
