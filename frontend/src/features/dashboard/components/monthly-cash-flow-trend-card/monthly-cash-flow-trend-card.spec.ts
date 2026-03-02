import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCashFlowTrendCard } from './monthly-cash-flow-trend-card';

describe('MonthlyCashFlowTrendCard', () => {
  let component: MonthlyCashFlowTrendCard;
  let fixture: ComponentFixture<MonthlyCashFlowTrendCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyCashFlowTrendCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyCashFlowTrendCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
