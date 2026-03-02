import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategorySummaryCard } from './budget-category-summary-card';

describe('BudgetCategorySummaryCard', () => {
  let component: BudgetCategorySummaryCard;
  let fixture: ComponentFixture<BudgetCategorySummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCategorySummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCategorySummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
