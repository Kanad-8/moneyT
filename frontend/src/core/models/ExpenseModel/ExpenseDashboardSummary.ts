
export interface ExpenseDashboardSummary {
    //Stat Cards
    totalAmount:number;
    averageTransaction:number;
    count:number;

    categoryBreakdown:{
        categoryName:string,
        percentage:number
    }[];
}