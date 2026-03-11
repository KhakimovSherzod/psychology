import type { IAccessTokenPayload, IDeviceTokenPayload, IGenerateTokens, IRefreshTokenPayload, ITokens, ITokenService } from "../../application/ports/token.service"
import jwt from 'jsonwebtoken'

export class JwtTokenService implements ITokenService {
  private secret = process.env.JWT_SECRET as string

  async generateAccessToken(payload: IAccessTokenPayload): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: '15m' })
  }

  async generateRefreshToken(payload: IRefreshTokenPayload): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' })
  }

  async generateDeviceToken(payload: IDeviceTokenPayload): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: '100y' }) // Device token can have longer lifetime
  }

  async generateTokens(payload: IGenerateTokens): Promise<ITokens> {
    const accessToken = await this.generateAccessToken({ userId: payload.userId, role: payload.role })
    const refreshToken = await this.generateRefreshToken({ userId: payload.userId })
    const deviceToken = await this.generateDeviceToken({ userId: payload.userId, deviceId: payload.deviceId })

    return { accessToken, refreshToken, deviceToken }
  }

  verifyAccessToken(token: string): IAccessTokenPayload | null {
    try {
      return jwt.verify(token, this.secret) as IAccessTokenPayload
    } catch {
      return null
    }
  }

  verifyRefreshToken(token: string): IRefreshTokenPayload | null {
    try {
      return jwt.verify(token, this.secret) as IRefreshTokenPayload
    } catch {
      return null
    }
  }

  verifyDeviceToken(token: string): IDeviceTokenPayload | null {
    try {
      return jwt.verify(token, this.secret) as IDeviceTokenPayload
    } catch {
      return null
    }
  }
}
