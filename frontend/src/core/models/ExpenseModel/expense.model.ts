import { Timestamp } from "rxjs"

export class Expenses {
    id?:number
    category:string
    description:string
    amount:number
    date:Date

    constructor(
    expense_id:number,
    category:string,
    description:string,
    amount:number,
    date:Date){
        this.amount=amount;
        this.category=category;
        this.description=description;
        this.date=date;
        this.id=expense_id;
    }

}
