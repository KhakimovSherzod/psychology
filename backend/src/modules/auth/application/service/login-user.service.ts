import { Device } from "@/modules/user/domain/entities/device.entity"
import { InvalidPinVerification } from "@/shared/errors/application/InvalidPinVerification"

import type { ITokenService } from "../ports/token.service"
import type { PinHasher } from "../ports/pinHasher"
import type { IUserRepository } from "@/modules/user/application/repositories/user.repository"

export class LoginUserService {
  constructor(
    private userRepository: IUserRepository,
    private pinHasher: PinHasher,
    private tokenService: ITokenService
  ) {}

  async login(
    deviceId: string,
    pin: string,
    phone?: string,
    deviceInfo?: {
      deviceName?: string | undefined
      deviceType?: string | undefined
      os?: string | undefined
      browser?: string | undefined
      ipAddress?: string | undefined
      deviceToken?: string | undefined
    }
  ) {
    // 1️⃣ Try to find the user by phone or device UUID
    const user = await this.userRepository.findByPhoneOrDeviceId(deviceId, phone)

    let deviceToken = null;
    
    if (!user) {
      // 2️⃣ If the user doesn't exist, create a deviceToken
      deviceToken = await this.tokenService.generateDeviceToken({
        deviceId: deviceId,
        userId: deviceId // Use the deviceUuid as a pseudo user ID
      });
      return {
        accessToken: null, // No access token without a user
        refreshToken: null, // No refresh token without a user
        deviceToken // Return the device token for the new device
      };
    }

    // 3️⃣ Verify PIN if the user exists
    const isPinValid = await this.pinHasher.verify(pin, user.pinHashValue)
    if (!isPinValid) throw new InvalidPinVerification()

    // 4️⃣ Update last login
    user.updateLastLogin()

    // 5️⃣ Handle the device (mark as used or add new device)
    const existingDevice = user.getDevices().find(d => d.uuid === deviceId)

    if (existingDevice) {
      // Mark the device as used if it already exists
      existingDevice.markUsed();
    } else {
      // If it's a new device, create and add the device
      const newDevice =  Device.create(
        deviceId,
        String(user.id), // ensure user id is a string
        deviceInfo?.deviceName,
        deviceInfo?.deviceType,
        deviceInfo?.os,
        deviceInfo?.browser,
        deviceInfo?.ipAddress,
        deviceInfo?.deviceToken
      );
      user.addDevice(newDevice);

      // If it's a new device, generate the deviceToken
      if (deviceInfo?.deviceToken) {
        deviceToken = await this.tokenService.generateDeviceToken({
          deviceId: deviceId,
          userId: user.id
        });
      }
    }

    // 6️⃣ Save the user with the updated device list
    await this.userRepository.save(user)

    // 7️⃣ Generate access and refresh tokens
    const tokens = await this.tokenService.generateTokens({
      userId: user.id,
      role: user.roleValue,
      deviceId: deviceId
    })

    // 8️⃣ Return access token, refresh token, and device token (if it was generated)
    return {
      ...tokens,
      deviceToken
    }
  }
}
