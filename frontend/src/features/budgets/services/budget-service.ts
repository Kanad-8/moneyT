import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable ,tap,map} from 'rxjs';
import { MonthlyBudget } from '../../../core/models/BudgetModel/MonthlyBudget';
import { Budget } from '../../../core/models/BudgetModel/Budget';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BudgetSummary } from '../../../core/models/BudgetModel/BudgetSummary';
import { CategoryLimit } from '../../../core/models/BudgetModel/CategoryLimit';
import { CategoryBudget } from '../../../core/models/BudgetModel/CategoryBudget';
import { UnBudgetedCategory } from '../../../core/models/BudgetModel/UnBudgetedCategory';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {

  private apiUrl =environment.apiUrl+'/budgets';

  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  public budgets$ = this.budgetsSubject.asObservable();

  private unbudgetedSpendingSubject = new BehaviorSubject<UnBudgetedCategory[]>([]);
  public unbudgetedSpending$= this.unbudgetedSpendingSubject.asObservable();

  constructor(private http:HttpClient){}

  refreshData(month:string,year:number):void{
    const params = new HttpParams()
    .set('month',month)
    .set('year',year.toString());

    this.http.get<Budget[]>(this.apiUrl,{params}).subscribe({
      next: (data)=> this.budgetsSubject.next(data),
      error: (err) => console.error("Failed to load Budgets" , err)

    });

    this.http.get<UnBudgetedCategory[]>(`${this.apiUrl}/unbudgeted`,{params}).subscribe({
      next:(data)=>this.unbudgetedSpendingSubject.next(data),
      error: (err) => console.error("Failed to load UnBudgetedSpendings",err)
    });
  }

  getBudgets(): Observable<Budget[]>{
    return this.budgets$;
  }

  createBudget(budget:Budget):Observable<Budget>{
    return this.http.post<Budget>(this.apiUrl,budget).pipe(
      tap(()=>{
        this.refreshData(budget.month,budget.year);
      })
    );
  }

  updateBudget(id:string | number,budget:Budget): Observable<Budget>{
    return this.http.put<Budget>(`${this.apiUrl}/${id}`,budget).pipe(
      tap(() => this.refreshData(budget.month,budget.year))
    );
  }

  deleteBudget(id:string | number, month:string,year:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(()=> this.refreshData(month,year))
    );
  }

  getRiskyBudgets(budgets:Budget[]):CategoryLimit[]{
    return budgets.filter(b => {
      const percentage = (b.spentAmount / b.limitAmount) *100;
      return percentage >= 80 && percentage < 100;
    }).map(b=>({
      categoryName:b.category,
      percentage:Math.round((b.spentAmount/b.limitAmount)*100)
    }));
  }

  getBudgetSummary(budgets:Budget[]):BudgetSummary{
    const totalBudgeted = budgets.reduce((sum,b) => sum+b.limitAmount,0);
    const totalSpent = budgets.reduce((sum , b)=> sum + b.spentAmount,0);

    return {
      totalBudgeted,
      totalSpent,
      remaining: totalBudgeted-totalSpent
    }
  }  

  getCategoryBudgetSummary(budget:Budget[]):Observable<CategoryBudget[]>{
    return this.budgets$.pipe(

      map((budgetList:Budget[])=>{

        return budgetList.map(b=>({
          name:b.category,
          Budget:b.limitAmount,
          Spent:b.spentAmount,
          remaining:b.limitAmount-b.spentAmount
        }))
      })
    )
  }

  getUnBudgetedSpending(month:string,year:number):Observable<UnBudgetedCategory[]>{
    const params= new HttpParams()
    .set('month',month)
    .set('year',year.toString());
    
    return this.http.get<UnBudgetedCategory[]>(`${this.apiUrl}/unbudgeted`,{params});
  }


}
