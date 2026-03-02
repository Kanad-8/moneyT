import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, OnInit ,Output} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Expenses } from '../../../../core/models/ExpenseModel/expense.model';
import { FilterState2 } from '../../../../core/models/FilterState';
import { ExpenseService } from '../../services/expense-service';
import { NormalizeInput } from '../../../../shared/normalize-input';


@Component({
  selector: 'app-view-all-expenses-modal',
  imports: [FormsModule, CommonModule, NormalizeInput],
  templateUrl: './view-all-expenses-modal.html',
  styleUrl: './view-all-expenses-modal.scss',
})
export class ViewAllExpensesModal implements OnInit{

  @Output() close = new EventEmitter<void>();

  //State
  currentPage:number=1;
  totalItems:number =0;
  pageSize:number = 10;
  isLoading:boolean=false;
  expenses:Expenses[]=[];


  //Filter
  selectedCategory:string='';
  searchTerm:string='';
  startDate:string='';
  endDate:string='';
  constructor(private expenseService:ExpenseService){}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.isLoading=true;

    const filters:FilterState2={
      category:'',
      startDate:'',
      endDate:''
    };

    filters.category=this.selectedCategory;
    filters.startDate=this.startDate;
    filters.endDate=this.endDate;

   

    this.expenseService.loadExpenses(this.currentPage,this.pageSize,filters);

    this.expenseService.expenseList$.subscribe(eList =>{
      this.expenses=eList;
      this.isLoading=false;
    })

    this.expenseService.total$.subscribe(total=>this.totalItems=total);
  }
  
 


  onClose(){
    this.close.emit();
  }
 
  onNextPage(){
    if(this.currentPage * this.pageSize < this.totalItems){
      this.currentPage++;
      this.loadData();
    }
  }
  onPrevPage(){
    if(this.currentPage >1) {
      this.currentPage--;
      this.loadData();
    }
  }

   onSearch(){
    this.currentPage=1;
    this.loadData();
   }

  formatDate(dateStr: Date): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  onEnter(){
    
    this.loadData();
  }

  onFilterChange(){
    this.loadData();
  }
}
