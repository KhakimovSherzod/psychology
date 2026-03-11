import { CartPriceVO } from "../vo/cart.price.vo";

export class CartItem {
    constructor(
        private uuid:string,
        public readonly cartId:string,
        public readonly playlistId:string,
        private _price: CartPriceVO,
        public readonly createdAt?:Date,
        private _internalId?:number
    ){}
    static create(
        params:{
            uuid:string,
            cartId:string,
            playlistId:string,
            price:number
        }
    ){
        
        return new CartItem(
            params.uuid,
            params.cartId,
            params.playlistId,
            new CartPriceVO(params.price)
        )
    }

    static reconstruct(params:{
        uuid:string,
        cartId:string,
        playlistId:string,
        price:number,
        createdAt:Date,
        internalId:number
    }){
        return new CartItem(
                        params.uuid,
            params.cartId,
            params.playlistId,
            new CartPriceVO(params.price),
            params.createdAt,
            params.internalId
            
        )
    }

    get id():string{
        return this.uuid
    }
    get price():CartPriceVO{
        return this._price
    }
    get internalId():number{
        if(!this._internalId) throw new Error("internal id not found")
        return this._internalId    
    }

}