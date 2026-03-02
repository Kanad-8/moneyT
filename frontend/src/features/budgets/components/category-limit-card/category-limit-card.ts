import { Component } from '@angular/core';
import { CategoryLimit } from '../../../../core/models/BudgetModel/CategoryLimit';
import { Input } from '@angular/core';

@Component({
  selector: 'app-category-limit-card',
  imports: [],
  templateUrl: './category-limit-card.html',
  styleUrl: './category-limit-card.scss',
})
export class CategoryLimitCard {
  @Input() nearingCategories:CategoryLimit[] = [];

}
