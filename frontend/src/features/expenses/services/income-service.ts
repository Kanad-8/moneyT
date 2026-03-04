import { Injectable } from '@angular/core';
import { Income } from '../../../core/models/IncomeModel/IncomeResponse';
import { HttpClient,HttpParams } from '@angular/common/http';
import { BehaviorSubject,catchError,map,Observable, tap, throwError } from 'rxjs';
import { FilterState } from '../../../core/models/FilterState';
import { FilterState2 } from '../../../core/models/FilterState';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
    private apiUrl = environment.apiUrl+'/income';

  private incomeList = new BehaviorSubject<Income[]>([]);
  public incomeList$ = this.incomeList.asObservable();
  
  private totalSubject = new BehaviorSubject<number>(0);
  public total$ = this.totalSubject.asObservable();

  private totalIncome = new BehaviorSubject<number>(0);
  public totalIncome$ = this.totalIncome.asObservable();

  private currentState = {
    page: 1,
    limit: 10,
    filters: {} as FilterState | FilterState2 | undefined
  };

  constructor(private http: HttpClient) {}

  loadIncomes(
    page: number = 1,
    limit: number = 10,
    filters?: FilterState | FilterState2 
  ): void {

    this.currentState = { page, limit, filters };

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', 'date')
      .set('sortOrder', 'desc');

    if (filters) {
      // NOTE: Changed "category" to "source" to match the backend Income logic
      if (this.hasKeys<FilterState>(filters, ["source", "dateRange"])) {
        const Date = this.getDates(filters.dateRange);
        
        if (filters.source) params = params.set('source', filters.source);
        if (filters.dateRange) {
          params = params.set('startDate', Date[0].toISOString().split('T')[0]);
          params = params.set('endDate', Date[1].toISOString().split('T')[0]);
        }
      } else if (this.hasKeys<FilterState2>(filters, ["source", "endDate", "startDate"])) {
        if (filters.source) { params = params.set('source', filters.source); }
        if (filters.startDate) { params = params.set('startDate', filters.startDate); }
        if (filters.endDate) { params = params.set('endDate', filters.endDate); }
      }
    }

    this.http.get<{data: Income[], total: number}>(this.apiUrl, { params })
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (response) => {
          this.incomeList.next(response.data);
          this.totalSubject.next(response.total);
        }
      });
  }

  saveIncome(income: Income): Observable<Income> {
    if (income?.id) {
      return this.updateIncome(income.id, income);
    } else {
      
      return this.createIncome(income);
    }
  }

  createIncome(income: Partial<Income>): Observable<Income> {
    
    return this.http.post<Income>(this.apiUrl, income).pipe(
      tap(() => this.refreshCurrentView()),
      catchError(this.handleError)
    );
  }

  updateIncome(id: string | number, changes: Income): Observable<Income> {
    return this.http.put<Income>(`${this.apiUrl}/${id}`, changes).pipe(
      tap(() => { this.refreshCurrentView();  }),
      catchError(this.handleError)
    );
  }

  deleteIncome(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshCurrentView()),
      catchError(this.handleError)
    );
  }

  getTotalIncome():Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/totalIncome`).pipe(
      tap((total:number) =>{
        this.totalIncome.next(total);
      }))
  }


  private refreshCurrentView() {
    this.loadIncomes(
      this.currentState.page,
      this.currentState.limit,
      this.currentState.filters
    );
  }

  getRecentIncomes(limit: number = 5): Observable<Income[]> {
    return this.http.get<{data: Income[]}>(this.apiUrl, {
      params: new HttpParams().set('limit', limit.toString())
    }).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: any) {
    
    return throwError(() => new Error("Something went wrong"));
  }

  private getDates(dateRange: String): Date[] {
    var startDate: Date = new Date();
    var endDate: Date = new Date();

    if (dateRange == "current_month") {
      startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    }
    else if (dateRange == "last_30_days") {
      startDate.setDate(endDate.getDate() - 30);
    }
    else if (dateRange == "last_3_months") {
      startDate.setMonth(endDate.getMonth() - 3);
    }
    else {
      startDate = new Date(endDate.getFullYear(), 0, 1);
    }

    return [startDate, endDate];
  }

  private hasKeys<T extends object>(obj: any, keys: (keyof any)[]): obj is T {
    return keys.every(key => key in obj);
  }
}
