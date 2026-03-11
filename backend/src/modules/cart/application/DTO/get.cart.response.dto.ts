export type GetCartItemResponseDto = {
  uuid: string
  playlistId: string
  price: number
}

export type GetCartResponseDto = {
  uuid: string
  userId: string
  status: string
  items: GetCartItemResponseDto[]
  totalPrice: number
}