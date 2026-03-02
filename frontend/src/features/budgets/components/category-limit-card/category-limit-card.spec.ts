import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryLimitCard } from './category-limit-card';

describe('CategoryLimitCard', () => {
  let component: CategoryLimitCard;
  let fixture: ComponentFixture<CategoryLimitCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryLimitCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryLimitCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
