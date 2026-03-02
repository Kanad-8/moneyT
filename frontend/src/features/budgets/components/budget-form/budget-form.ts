import { Component, EventEmitter,Output ,Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { NormalizeInput } from '../../../../shared/normalize-input';

@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule,NormalizeInput],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.scss',
})
export class BudgetForm implements OnInit,OnChanges {

  @Input() dataToEdit:any = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  budgetForm: FormGroup;

  categories = ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Healthcare'];
  
  months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  modalTitle = "Add New Budget";
  submitButtonText="Save Budget";

  constructor(private fb:FormBuilder){
    this.budgetForm= this.fb.group({
       category:['',Validators.required],
       limitAmount:[null,[Validators.required,Validators.min(1)]],
       month:['',Validators.required],
       year:[2025,[Validators.required,Validators.min(2020),Validators.max(2100)]]
    });
  }

  ngOnInit():void {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['dataToEdit'] && this.dataToEdit){

      //Switch to "Edit  Mode"
      this.modalTitle = "Edit Budget";
      this.submitButtonText="Update Budget"

      //PreFill the Form 
      this.budgetForm.patchValue({
        category:this.dataToEdit.category,
        limitAmount:this.dataToEdit.limitAmount,
        month:this.dataToEdit.month,
        year:this.dataToEdit.year
      });
    }
  }

  onClose(){
    this.close.emit();
  }

  onSubmit(){
    if(this.budgetForm.valid){
      this.budgetForm.value
      this.save.emit(this.budgetForm.value);
      
      this.onClose();
    }else{
      this.budgetForm.markAllAsTouched();
    }
  }
}
