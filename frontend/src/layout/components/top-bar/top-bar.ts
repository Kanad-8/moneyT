import { Component } from '@angular/core';
import { SideBarToggle } from '../../services/side-bar-toggle';
import { ActivatedRoute, createUrlTreeFromSnapshot, NavigationEnd, Router, RouterLink } from '@angular/router';
import {filter} from 'rxjs/operators';
import { ModalService } from '../../../features/expenses/services/modal-service';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  pageTitle='';
  constructor(
    private sideBarService:SideBarToggle,
    private route:ActivatedRoute,
    private router:Router,
    private expenseModal:ModalService){
      this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() =>{
      let currentRoute = this.route.root;
      while(currentRoute.firstChild){
        currentRoute=currentRoute.firstChild;
      }
      this.pageTitle = currentRoute.snapshot.data['title'] || '';
    });
  }

  toggleSideBar(){
    this.sideBarService.toggleSideBar();
    
  }

  onIncomeModalClose(): void {
    this.expenseModal.closeIncomeModal();
  }

  onExpenseModalClose(): void {
    this.expenseModal.closeExpenseModal();
  }

  openAddIncome():void{
    this.expenseModal.openIncomeModal();
    this.navigateToTransactions();
  }

  openAddExpense():void{
    this.expenseModal.openExpenseModal();
    this.navigateToTransactions();
  }

  navigateToTransactions(){
    const tree = this.router.createUrlTree(['/app/transactions']);
    this.router.navigateByUrl(tree);
  }

}
