export interface PinHasher {
  hash(pin: string): Promise<string>
  verify(pin: string, hash: string): Promise<boolean>
}
