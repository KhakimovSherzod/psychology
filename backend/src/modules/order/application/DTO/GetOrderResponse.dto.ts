export type GetOrderResponse = {
  id: string
  userId: string
  status: string
  currency: string
  totalAmount: number
  createdAt: Date
  paidAt?: Date

  items: {
    id: string
    playlistId: string
    price: number
    currency: string
    createdAt: Date
  }[]
}