import { CurrencyPipe } from '@angular/common';
import { Component, OnChanges } from '@angular/core';
import { BudgetSummary } from '../../../../core/models/BudgetModel/BudgetSummary';
import { Input } from '@angular/core';

@Component({
  selector: 'app-budget-summary-card',
  imports: [CurrencyPipe],
  templateUrl: './budget-summary-card.html',
  styleUrl: './budget-summary-card.scss',
})
export class BudgetSummaryCard implements OnChanges{

  @Input() summary:BudgetSummary = {
    totalBudgeted:0,
    totalSpent:0,
    remaining:0
  };

  progressPercentage:number =0;

  ngOnChanges(){
    this.calculateProgress();
    

  }

  private calculateProgress(){
    if(this.summary.totalBudgeted > 0){
      const percent =  (this.summary.totalSpent/this.summary.totalBudgeted)*100;
      this.progressPercentage  = Math.min(percent,100);
      
    }else{
      this.progressPercentage=0;
    }
  }

}
