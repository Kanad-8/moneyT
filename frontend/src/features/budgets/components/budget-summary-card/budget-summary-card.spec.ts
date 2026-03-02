import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSummaryCard } from './budget-summary-card';

describe('BudgetSummaryCard', () => {
  let component: BudgetSummaryCard;
  let fixture: ComponentFixture<BudgetSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetSummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
