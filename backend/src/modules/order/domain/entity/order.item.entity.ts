export class OrderItem {
  constructor(
    private readonly _uuid: string,
    private readonly _playlistId: string,
    private readonly _price: number,
    private readonly _currency: string = 'UZS',
    private readonly _createdAt?: Date,
    private readonly _id?: number
  ) {}
  static create(
    uuid: string,
    playlistId: string,
    price: number,
    currency: string = 'UZS'
  ): OrderItem {
    return new OrderItem(uuid, playlistId, price, currency)
  }
static reconstruct(props: {
  uuid: string
  playlistId: string
  price: number
  currency: string
  createdAt: Date
  internalId?: number
}): OrderItem {
  return new OrderItem(
    props.uuid,
    props.playlistId,
    props.price,
    props.currency,
    props.createdAt,
    props.internalId
  )
}
  // --------- Getters ---------
  get internalId(): number {
    if (!this._id) {
      throw new Error('internal id xar doim bolishi kerak')
    }
    return this._id
  }
  get id(): string {
    return this._uuid
  }

  get playlistId(): string {
    return this._playlistId
  }

  get price(): number {
    return this._price
  }

  get currency(): string {
    return this._currency
  }

  get createdAt(): Date {
    if (!this._createdAt) {
      throw new Error('createdAt xar doim bolishi kerak')
    }
    return this._createdAt
  }
}
