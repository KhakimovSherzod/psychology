export type GetUserOrdersResponse = {
  id: string
  status: string
  currency: string
  totalAmount: number
  createdAt: Date
  paidAt?: Date
}