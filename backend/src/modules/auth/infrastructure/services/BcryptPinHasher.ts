import bcrypt from 'bcrypt'
import type { PinHasher } from '../../application/ports/pinHasher'

export class BcryptPinHasher implements PinHasher {
  async hash(pin: string): Promise<string> {
    return bcrypt.hash(pin, 10)
  }

  async verify(pin: string, hash: string): Promise<boolean> {
    return bcrypt.compare(pin, hash)
  }
}
