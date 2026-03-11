import { BaseRepositoryError } from './BaseRepositoryError'



export class OrderNotFound extends BaseRepositoryError {
  readonly code = 'ORDER_NOT_FOUND'

  constructor(orderId:string) {
    super(
      `Shu UUID order "${orderId}" topilmadi`
    )
  }
}