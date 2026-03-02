import { Injectable } from '@angular/core';
import { BarElement } from 'chart.js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isExpenseModalOpen = new BehaviorSubject<boolean>(false);
  private isViewAllOpen = new BehaviorSubject<boolean>(false);
  private isIncomeModalOpen = new BehaviorSubject<boolean>(false);
  private isViewAllOpenIncome = new BehaviorSubject<boolean>(false);

  isViewAllOpne$ = this.isViewAllOpen.asObservable();

  isExpenseModalOpen$ = this.isExpenseModalOpen.asObservable();
  isIncomeModalOpen$ = this.isIncomeModalOpen.asObservable();

  public openIncomeModal(){
    this.isIncomeModalOpen.next(true);
  }

  public closeIncomeModal(){
    this.isIncomeModalOpen.next(false);
  }

  public openExpenseModal(){
    this.isExpenseModalOpen.next(true);
  }

  public closeExpenseModal(){
    this.isExpenseModalOpen.next(false);
  }

  public openViewAll(){
    this.isViewAllOpen.next(true);
  }

  public closeViewAll(){
    this.isViewAllOpen.next(false);
  }
  
}
