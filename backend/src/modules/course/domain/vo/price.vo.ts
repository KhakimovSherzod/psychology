import { PriceCannotBeNegative } from "@/shared/errors/domain/PriceCannotBeNegative"

export class PriceVO {
  readonly amount: number 

  constructor(amount: number) {
    if (!Number.isInteger(amount) && amount !== null && amount < 0) throw new PriceCannotBeNegative()
    this.amount = amount
  }

  static fromNumber(amount: number):PriceVO {
    if (!Number.isInteger(amount) || amount < 0) throw new PriceCannotBeNegative()
    return new PriceVO(amount)
  }
}
