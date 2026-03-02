import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllExpensesModal } from './view-all-expenses-modal';

describe('ViewAllExpensesModal', () => {
  let component: ViewAllExpensesModal;
  let fixture: ComponentFixture<ViewAllExpensesModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllExpensesModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllExpensesModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
