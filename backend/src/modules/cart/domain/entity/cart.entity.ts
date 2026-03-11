import type { CartStatus } from "@prisma/client";
import { CartItem } from "./cart.item";

export class Cart{
    constructor(
        private uuid:string,
        public readonly userId:string,
        private _status:CartStatus,
        private _items: CartItem[],
        private _createdAt?:Date,
        private _internalId?:number
    ){}

    static create(params:{
        uuid:string,
        userId:string,
        status:CartStatus,
        items:CartItem[]
    }){
        return new Cart(
            params.uuid,
            params.userId,
            params.status,
            params.items
        )
    }

    static reconstruct(params:{
        uuid:string,
        userId:string,
        status:CartStatus,
        items:CartItem[]
        createdAt:Date,
        internalId:number
    }){
        return new Cart(
            params.uuid,
            params.userId,
            params.status,
            params.items,
            params.createdAt,
            params.internalId
        )
    }

    get id():string{
        return this.uuid
    }
    get status():CartStatus{
        return this._status
    }
    get createdAt():Date{
        if(!this._createdAt) throw new Error("yaratilgan vaqti bo'lishi shart")
        return this._createdAt
    }
    get internalId():number{
        if(!this._internalId) throw new Error("internal id bolishi kerak")
        return this._internalId    
    }
      get items(): CartItem[] {
        return [...this._items] 
      }

      addItem(playlistId:string, price:number) {
    // Check for duplicate playlist
    if (this._items.some(item => item.playlistId === playlistId)) {
    //   throw new Error("This playlist is already in the cart");
    return;
    }

    // Create new CartItem
    const newItem = CartItem.create({
      uuid: crypto.randomUUID(),
      cartId: this.uuid,
      playlistId: playlistId,
      price: price
    });

    // Add to cart
    this._items.push(newItem);
  }
  removeItem(playlistId: string) {

  const index = this._items.findIndex(
    item => item.playlistId === playlistId
  );

  if (index === -1) {
    // item not found in cart
    return;
    // or throw new Error("Item not found in cart")
  }

  this._items.splice(index, 1);
}
clear() {
  if (this._items.length === 0) return;
  this._items = [];
}

totalPrice(): number {
  return this._items.reduce(
    (total, item) => total + item.price.amount,
    0
  );
}
}

