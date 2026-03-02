import { Component, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'app-budget-top-bar',
  imports: [],
  templateUrl: './budget-top-bar.html',
  styleUrl: './budget-top-bar.scss',
})
export class BudgetTopBar {
  @Input() currentMonthYear :string = 'November 2025';
  @Output() createBudget = new EventEmitter<void>();
  @Output() prevMonth = new EventEmitter<void>();
  @Output() nextMonth = new EventEmitter<void>();

  
  
}
