export class Income {
  id?: number;
  source: string;
  description: string;
  amount: number;
  date: Date;

  constructor(id:number,source:string,description:string,amount:number,date:Date){
    this.id = id;
    this.source=source;
    this.description=description;
    this.amount=amount;
    this.date=date;
  }
}