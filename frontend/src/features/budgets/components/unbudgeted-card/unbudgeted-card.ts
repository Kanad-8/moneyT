import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { UnBudgetedCategory } from '../../../../core/models/BudgetModel/UnBudgetedCategory';
import { Input } from '@angular/core';

@Component({
  selector: 'app-unbudgeted-card',
  imports: [CurrencyPipe],
  templateUrl: './unbudgeted-card.html',
  styleUrl: './unbudgeted-card.scss',
})
export class UnbudgetedCard {

  @Input() List:UnBudgetedCategory[]=[];

  get totalUnbudgeted():number{
    return this.List.reduce((sum,item) => sum+item.amount,0);

  }


}
