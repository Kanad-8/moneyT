import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, Observable, throwError ,map, BehaviorSubject,tap} from 'rxjs';
import { Expenses } from '../../../core/models/ExpenseModel/expense.model';
import { ExpenseFilters } from '../../../core/models/ExpenseModel/ExpenseFilters';
import { ExpenseDashboardSummary } from '../../../core/models/ExpenseModel/ExpenseDashboardSummary';
import { FilterState, FilterState2 } from '../../../core/models/FilterState';
import { BarElement } from 'chart.js';


@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl ='http://localhost:8080/expenses'

  private expenseList = new BehaviorSubject<Expenses[]>([]);
  public expenseList$ = this.expenseList.asObservable();
  
  private totalSubject = new BehaviorSubject<number>(0);
  public total$ = this.totalSubject.asObservable();

  private currentState ={
    page:1,
    limit:10,
    filters:{} as FilterState | FilterState2 | undefined
  };

  constructor(private http:HttpClient){}

  loadExpenses(
    page:number =1,
    limit:number =10,
    filters?:FilterState | FilterState2 
  ):void{

    this.currentState ={page,limit,filters};

    let params = new HttpParams()
    .set('page',page.toString())
    .set('limit',limit.toString())
    .set('sortBy','date')
    .set('sortOrder','desc')

    if(filters){
      if(this.hasKeys<FilterState>(filters,["category","dateRange"]) ){
      const Date = this.getDates(filters.dateRange);
     // if(filters.search) params=params.set('search',filters.search);
      if(filters.category) params=params.set('category',filters.category);
      if(filters.dateRange) {
        params=params.set('startDate',Date[0].toISOString().split('T')[0]);
        params = params.set('endDate',Date[1].toISOString().split('T')[0]);
      }
    }else if(this.hasKeys<FilterState2>(filters,["category","endDate","startDate"])){
      
    
      if(filters.category){params = params.set('category',filters.category); }
      if(filters.startDate) {params= params.set('startDate',filters.startDate);}
      if(filters.endDate) {params= params.set('endDate',filters.endDate);}

      
    }
    }
    this.http.get<{data:Expenses[],total:number}>(this.apiUrl,{params})
    .pipe(catchError(this.handleError))
    .subscribe({
      next: (response) => {
        this.expenseList.next(response.data);
        this.totalSubject.next(response.total);
      }
    });
  }

  saveExpense(expense:Expenses):Observable<Expenses>{
    if(expense?.id){
      return this.updateExpense(expense.id,expense);
    }else{
      
      return this.createExpense(expense);
    }
  }

  createExpense(expense:Partial<Expenses>):Observable<Expenses>{
    
    return this.http.post<Expenses>(this.apiUrl,expense).pipe(
      tap(()=>this.refreshCurrentView()),
      catchError(this.handleError)
    );
  }

  updateExpense(id:string | number,changes :Expenses):Observable<Expenses>{
    return this.http.put<Expenses>(`${this.apiUrl}/${id}`,changes).pipe(
      tap(()=>{ this.refreshCurrentView(); }),
      catchError(this.handleError)
    )
  }

  deleteExpense(id:string | number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshCurrentView()),
      catchError(this.handleError)
    );
  }

  getStats(filters?:FilterState):Observable<ExpenseDashboardSummary>{
    let params = new HttpParams();

    var startDate:Date = new Date();
    var endDate:Date = new Date();

    if(filters?.dateRange == "current_month"){
      startDate = new Date(new Date().getFullYear(),new Date().getMonth() ,1);
    }
    else if(filters?.dateRange == "last_30_days"){
      startDate.setDate(endDate.getDate() - (30 * 24 * 60 * 60 * 1000));
    }
    else if(filters?.dateRange == "last_3_months"){
      startDate.setMonth(endDate.getMonth() -3);
    }
    else {
      startDate= new Date(endDate.getFullYear(),0,1);
    }

    if(filters){
      if(filters.dateRange){
        params =params.set('startDate',startDate.toISOString().split('T')[0]);
        params = params.set('endDate',endDate.toISOString().split('T')[0]);
        
        
      } 
      if(filters.category){
        params=params.set('category',filters.category);
      }
    }

    return this.http.get<ExpenseDashboardSummary>(`${this.apiUrl}/stats`,{params})
      .pipe(catchError(this.handleError));

  }

  private refreshCurrentView(){
    this.loadExpenses(
      this.currentState.page,
      this.currentState.limit,
      this.currentState.filters
    );
  }

  getRecentTransactions(limit:number =5):Observable<Expenses[]>{
    return this.http.get<{data:Expenses[]}>(this.apiUrl,{
      params:new HttpParams().set('limit',limit.toString())
    }).pipe(
      map(res=>res.data),
      catchError(this.handleError)
    );
  }
  
  private handleError(error:any){
    
    return throwError(() => new Error("Something went wrong"));
  }

  private getDates(dateRange:String):Date[]{

    var startDate:Date = new Date();
    var endDate:Date = new Date();

    if(dateRange == "current_month"){
      startDate = new Date(new Date().getFullYear(),new Date().getMonth() ,1);
    }
    else if(dateRange == "last_30_days"){
      startDate.setDate(endDate.getDate() - (30 * 24 * 60 * 60 * 1000));
    }
    else if(dateRange == "last_3_months"){
      startDate.setMonth(endDate.getMonth() -3);
    }
    else {
      startDate= new Date(endDate.getFullYear(),0,1);
    }

    return [startDate,endDate];
  }

  private hasKeys<T extends object>(obj: any, keys: (keyof T)[]): obj is T {
  return keys.every(key => key in obj);
}

}
