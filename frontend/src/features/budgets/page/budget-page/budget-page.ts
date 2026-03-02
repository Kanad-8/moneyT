import { Component, OnInit } from '@angular/core';
import { BudgetTopBar } from "../../components/budget-top-bar/budget-top-bar";
import { BudgetSummaryCard } from '../../components/budget-summary-card/budget-summary-card';
import { BudgetSummary } from '../../../../core/models/BudgetModel/BudgetSummary';
import { BudgetCategorySummaryCard } from "../../components/budget-category-summary-card/budget-category-summary-card";
import { CategoryBudget } from '../../../../core/models/BudgetModel/CategoryBudget';
import { CategoryLimitCard } from "../../components/category-limit-card/category-limit-card";
import { UnbudgetedCard } from "../../components/unbudgeted-card/unbudgeted-card";
import { BudgetForm } from "../../components/budget-form/budget-form";
import { ReactiveFormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget-service';
import { Budget } from '../../../../core/models/BudgetModel/Budget';
import { Observable } from 'rxjs';
import { CategoryLimit } from '../../../../core/models/BudgetModel/CategoryLimit';
import { UnBudgetedCategory } from '../../../../core/models/BudgetModel/UnBudgetedCategory';

@Component({
  selector: 'app-budget-page',
  imports: [BudgetTopBar, BudgetSummaryCard, BudgetCategorySummaryCard, CategoryLimitCard, UnbudgetedCard, BudgetForm,ReactiveFormsModule],
  templateUrl: './budget-page.html',
  styleUrl: './budget-page.scss',
})
export class BudgetPage implements OnInit {
  budgets:Budget[]=[];
  summary:BudgetSummary={totalBudgeted:0,totalSpent:0,remaining:0}
  riskyBudgets:CategoryLimit[] =[];
  categorySummary:CategoryBudget[]=[];
  unBudgetedSpending:UnBudgetedCategory[]=[];

  isModalOpen=false;
  selectedMonth='';
  selectedYear=2025;
  
  openModal(){
    this.isModalOpen = true;
  }

  closeModal(){
    this.isModalOpen = false;
  }

  handleSaveBudget(data:Budget):void{
    let request$:Observable<Budget>;


    if(data.id){
      request$= this.budgetService.updateBudget(data.id,data);
    }else{
      request$=this.budgetService.createBudget(data);
    }

    request$.subscribe({
      next:(result) =>{
        
        this.closeModal();
      },
      error: (err)=>{
        console.error('Failed to save budget',err);
        alert('Error saving budget.Please try again');
      }
    });
  }

  constructor(public budgetService:BudgetService){}

  ngOnInit(){
    //Intial Load
    this.selectedMonth =this.getMonth();
    this.selectedYear = new Date().getFullYear();
    this.budgetService.refreshData(this.selectedMonth,this.selectedYear);

    this.budgetService.budgets$.subscribe(data => {
      this.budgets=data;
      this.summary= this.budgetService.getBudgetSummary(data);
      this.riskyBudgets= this.budgetService.getRiskyBudgets(data);
      this.budgetService.getCategoryBudgetSummary(data).subscribe(data=> {this.categorySummary=data});
    } )

    this.budgetService.unbudgetedSpending$.subscribe(
      data=>{
        this.unBudgetedSpending=data;
      }
    );
  }

  nextMonth(){
    this.selectedMonth = this.getMonth(this.selectedMonth,1);
    if(this.selectedMonth == "January") this.selectedYear=this.selectedYear+1;
    this.budgetService.refreshData(this.selectedMonth,this.selectedYear);
  }
  prevMonth(){
    this.selectedMonth = this.getMonth(this.selectedMonth,-1);
    if(this.selectedMonth == "December") this.selectedYear=this.selectedYear-1;
    this.budgetService.refreshData(this.selectedMonth,this.selectedYear);

  }

  onMonthChange(newMonth:string){
    this.selectedMonth= newMonth;
    this.budgetService.refreshData(this.selectedMonth,this.selectedYear);
  }

   getMonth(month:string,num:number):string;
   getMonth():string;

   getMonth(month?:string,num?:number){
    const now = new Date();
     const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    if(typeof month === "string" && typeof num === "number"){
      var mon = months.findIndex(m => m == month);
      if(num < 0){
        const pervM = (mon+11) % 12;
        return months[pervM];
      }else{
        const nextM = (mon+1)%12;
        return months[nextM];
      }
    }

    return months[now.getMonth()];


  }

  

}
