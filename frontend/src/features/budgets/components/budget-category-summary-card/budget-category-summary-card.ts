import { CommonModule, CurrencyPipe, LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CategoryBudget } from '../../../../core/models/BudgetModel/CategoryBudget';

@Component({
  selector: 'app-budget-category-summary-card',
  imports: [CurrencyPipe,LowerCasePipe,CommonModule],
  templateUrl: './budget-category-summary-card.html',
  styleUrl: './budget-category-summary-card.scss',
})
export class BudgetCategorySummaryCard {

  @Input() categories: CategoryBudget[] =[];

  getProgressWidth(spent:number,budget:number){
    if(budget>0){
      const percent = (spent/budget)*100;
      
      return Math.min(percent,100);
    }
    else return 0;

  }

  isOverBudget(item:CategoryBudget):boolean{
    return item.Spent>item.Budget;
  }


}
