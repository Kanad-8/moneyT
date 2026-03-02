import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTopBar } from './budget-top-bar';

describe('BudgetTopBar', () => {
  let component: BudgetTopBar;
  let fixture: ComponentFixture<BudgetTopBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetTopBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTopBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
