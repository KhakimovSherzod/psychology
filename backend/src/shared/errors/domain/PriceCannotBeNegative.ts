import { BaseDomainError } from './BaseDomainError'

export class PriceCannotBeNegative extends BaseDomainError {
  readonly code = 'PRICE_CANNOT_BE_NEGATIVE'
  constructor() {
    super("Narx manfiy bo‘lishi mumkin emas")
  }
}
