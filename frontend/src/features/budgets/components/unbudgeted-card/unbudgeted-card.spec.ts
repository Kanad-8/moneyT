import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbudgetedCard } from './unbudgeted-card';

describe('UnbudgetedCard', () => {
  let component: UnbudgetedCard;
  let fixture: ComponentFixture<UnbudgetedCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnbudgetedCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnbudgetedCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
