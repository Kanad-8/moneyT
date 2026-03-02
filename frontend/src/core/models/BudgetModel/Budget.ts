export interface Budget{
    id?: string| number;
    category :string;
    limitAmount:number;
    spentAmount:number;
    month:string;
    year:number;    
}