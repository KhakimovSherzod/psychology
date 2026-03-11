import { BaseApplicationError } from "./BaseApplicationError";

export class InvalidPinVerification extends BaseApplicationError{
    readonly code = "Invalid_Pin_Verification"

      constructor(message?: string) {
    super(message ?? "Noto'g'ri pin. Pin mos kelmadi")
  }
}