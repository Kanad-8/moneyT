import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingCategoryCard } from './spending-category-card';

describe('SpendingCategoryCard', () => {
  let component: SpendingCategoryCard;
  let fixture: ComponentFixture<SpendingCategoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingCategoryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendingCategoryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
