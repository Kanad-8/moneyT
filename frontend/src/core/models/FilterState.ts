export interface FilterState{
    dateRange: string;
    category?: string;
    source?:string;
}

export interface FilterState2{
    source?:string,
    category?: string;
    startDate:string,
    endDate:string
}