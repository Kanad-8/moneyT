import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallMonthlyBudgetCard } from './overall-monthly-budget-card';

describe('OverallMonthlyBudgetCard', () => {
  let component: OverallMonthlyBudgetCard;
  let fixture: ComponentFixture<OverallMonthlyBudgetCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallMonthlyBudgetCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallMonthlyBudgetCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
