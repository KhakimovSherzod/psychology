import type { User } from "@/modules/user/domain/entities/user.entity"
import type { UserRole } from "@/shared/enums/UserRole.enum"


export interface RegisterUserDTO {
  name: string
  phone: string
  pin: string
  deviceId: string      
  deviceName?: string | undefined     
  deviceType?: string | undefined     
  os?: string | undefined              
  browser?: string | undefined         
  ipAddress?: string | undefined       
  deviceToken?: string | undefined     
}


export class RegisterUserResponseDTO {
  constructor(
    public id: string,
    public role: UserRole
  ) {}

  static fromDomain(user: User): RegisterUserResponseDTO {
    return new RegisterUserResponseDTO(
      user.id,
      user.roleValue
    )
  }
}
