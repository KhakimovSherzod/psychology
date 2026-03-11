export class CartPriceVO {
    readonly _amount: number;
    constructor(amount:number){
        if(!amount) throw new Error('pulning miqdori mavjud emas')
        if (!Number.isInteger(amount)) throw new Error('pul butun son bo‘lishi kerak')
        if(amount <= 0) throw new Error('pulning miqdori 0 ga teng yoki kichik bolishi mumkin emas')
        this._amount = amount
    }

    get amount(){
        return this._amount
    }
}