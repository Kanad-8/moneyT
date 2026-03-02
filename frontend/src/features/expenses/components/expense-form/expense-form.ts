import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { Form, FormBuilder,FormGroup,FormsModule,Validator, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Output,Input } from '@angular/core';
import { Expenses } from '../../../../core/models/ExpenseModel/expense.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.scss',
  providers:[DatePipe],
  standalone:true
})

export class ExpenseForm implements OnInit {

  expenseForm!:FormGroup;
  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<Expenses>();
  @Input() expenseToEdit:Expenses | null = null;
  modalTitle = "Add New Expense";
  submitButtonText="Save Expense";

  private  fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);

  constructor(){}

  ngOnInit():void{
    this.expenseForm=this.fb.group(
      {
        category:[null,[Validators.required]],
        description:[null],
        amount:[null,[Validators.required,Validators.min(0.01)]],
        date:[null,[Validators.required]]
      });

      if(this.expenseToEdit){
      this.modalTitle="Edit Expense"
      this.submitButtonText="Update Expense"

      const formValue:any = {...this.expenseToEdit};
      formValue.date = this.datePipe.transform(this.expenseToEdit.date,'yyyy-MM-dd');
      formValue.category=this.expenseToEdit.category.toLowerCase();
      this.expenseForm.patchValue(formValue);
    }
  }

  onSubmit(){
    if(this.expenseForm.valid){
      
      let updatedExpense:Expenses = this.expenseForm.value;
      if(this.expenseToEdit){
        updatedExpense.id=this.expenseToEdit.id;

      }
      
      this.formSubmit.emit(updatedExpense);
      this.close.emit();
    }else{
      
    }
  }

  onClose(){
    this.close.emit();
  }

}
