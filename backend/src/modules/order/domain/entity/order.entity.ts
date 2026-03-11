import { OrderStatus } from '@prisma/client'
import type { OrderItem } from './order.item.entity'

export class Order {
  constructor(
    private readonly _uuid: string,
    public readonly userId: string,
    private _items: OrderItem[],
    private _status: OrderStatus,
    public readonly currency: string = 'UZS',
    public readonly createdAt?: Date,
    private _paidAt?: Date,
    public readonly internalId?: number
  ) {}

  static create(uuid: string, userId: string, items: OrderItem[], currency: string = 'UZS'): Order {
    return new Order(uuid, userId, items, OrderStatus.CREATED, currency)
  }
  static reconstruct(props: {
  uuid: string
  userId: string
  items: OrderItem[]
  status: OrderStatus
  currency: string
  createdAt: Date
  paidAt?: Date
  internalId?: number
}): Order {
  return new Order(
    props.uuid,
    props.userId,
    props.items,
    props.status,
    props.currency,
    props.createdAt,
    props.paidAt,
    props.internalId
  )
}
  // ----------------- Aggregate Root Methods -----------------

  get id(): string {
    return this._uuid
  }
  get internalIdValue(): number {
    if (!this.internalId) throw new Error('Internal ID ornatilmagan')
    return this.internalId
  }

  get items(): OrderItem[] {
    return [...this._items] // defensive copy
  }

  get status(): OrderStatus {
    return this._status
  }

  get totalAmount(): number {
    return this._items.reduce((sum, item) => sum + item.price, 0)
  }

  get paidAt(): Date | undefined {
    return this._paidAt
  }

  addItem(item: OrderItem) {
    if (this._status === 'PAID') {
      throw new Error('Cannot modify paid order')
    }

    if (this._items.some(i => i.playlistId === item.playlistId)) {
      throw new Error('Playlist already exists in order')
    }

    this._items.push(item)
  }

  markAsPaid(paidAt: Date = new Date()) {
    if (this._status === 'PAID') throw new Error('Order already paid')
    this._status = 'PAID'
    this._paidAt = paidAt
  }

  cancel() {
    if (this._status === 'PAID') throw new Error('Cannot cancel paid order')
    this._status = 'CANCELLED'
  }

  expire() {
    if (this._status === 'PAID') throw new Error('Cannot expire paid order')
    this._status = 'EXPIRED'
  }
}



