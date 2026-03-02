import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCard1 } from './stat-card1';

describe('StatCard1', () => {
  let component: StatCard1;
  let fixture: ComponentFixture<StatCard1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCard1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatCard1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
