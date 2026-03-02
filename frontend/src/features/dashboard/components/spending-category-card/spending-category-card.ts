import { Component } from '@angular/core';
import { CategoryLimit } from '../../../../core/models/BudgetModel/CategoryLimit';
import { Input } from '@angular/core';

@Component({
  selector: 'app-spending-category-card',
  imports: [],
  templateUrl: './spending-category-card.html',
  styleUrl: './spending-category-card.scss',
})
export class SpendingCategoryCard {
  @Input() categories:CategoryLimit[]=[];


}
