import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TransactionFormData, FormMode } from '../../../../core/models/IncomeModel/TransactionFormData';
import { Expenses } from '../../../../core/models/ExpenseModel/expense.model';
import { Income } from '../../../../core/models/IncomeModel/IncomeResponse';



@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
  providers:[DatePipe]
})
export class TransactionForm {
  // ── Mode ─────────────────────────────────────────────────────────────────
  /** 'expense' | 'income' — drives labels, options, colours */
  @Input() mode: FormMode = 'expense';

  // ── Pre-fill for Edit mode ────────────────────────────────────────────────
  @Input() expenseToEdit: Expenses | null     = null;
  @Input() incomeToEdit:  Income | null = null;

  // ── Outputs ───────────────────────────────────────────────────────────────
  @Output() close        = new EventEmitter<void>();
  @Output() incomeSubmit   = new EventEmitter<Income>();
  @Output() expenseSubmit = new EventEmitter<Expenses>();

  // ── Services ──────────────────────────────────────────────────────────────
  private fb       = inject(FormBuilder);
  private datePipe = inject(DatePipe);

  // ── State ─────────────────────────────────────────────────────────────────
  form!:            FormGroup;
  isEditMode        = false;
  modalTitle        = '';
  submitButtonText  = '';

  // ── Computed UI strings ───────────────────────────────────────────────────

  get tagLabel(): string {
    return this.mode === 'income' ? 'Source' : 'Category';
  }

  get tagPlaceholder(): string {
    return this.mode === 'income' ? 'e.g., Salary, Freelance, Rental…' : 'e.g., Groceries, Transport, Utilities…';
  }

  get descriptionPlaceholder(): string {
    return this.mode === 'income'
      ? 'e.g., Monthly salary credit'
      : 'e.g., Groceries from supermarket';
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.isEditMode = !!(this.expenseToEdit ?? this.incomeToEdit);
    this.modalTitle       = this.resolveTitle();
    this.submitButtonText = this.resolveSubmitText();

    this.form = this.fb.group({
      tag:         [null, [Validators.required]],
      description: [null],
      amount:      [null, [Validators.required, Validators.min(0.01)]],
      date:        [null, [Validators.required]],
    });

    if (this.isEditMode) {
      this.patchForm();
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
 onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    if (this.mode === 'expense') {
      this.emitExpense(raw);
    } else {
      this.emitIncome(raw);
    }

    this.close.emit();
  }

  // ── Expense emit ──────────────────────────────────────────────────────────
  private emitExpense(raw: any): void {
    const dto: Expenses = {
      category:    raw.tag,
      description: raw.description ?? '',
      amount:      raw.amount,
      date:        raw.date,
    };

    // Only include id when editing — backend generates it on create
    if (this.isEditMode && this.expenseToEdit?.id) {
      dto.id = this.expenseToEdit.id;
    }

    this.expenseSubmit.emit(dto);
  }

  // ── Income emit ───────────────────────────────────────────────────────────
  private emitIncome(raw: any): void {
    const dto: Income = {
      source:      raw.tag,
      description: raw.description ?? '',
      amount:      raw.amount,
      date:        raw.date,
    };

    // Only include id when editing — backend generates it on create
    if (this.isEditMode && this.incomeToEdit?.id) {
      dto.id = this.incomeToEdit.id;
    }

    this.incomeSubmit.emit(dto);
  }

  onClose(): void {
    this.close.emit();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private resolveTitle(): string {
    const noun = this.mode === 'income' ? 'Income' : 'Expense';
    return this.isEditMode ? `Edit ${noun}` : `Add New ${noun}`;
  }

  private resolveSubmitText(): string {
    const noun = this.mode === 'income' ? 'Income' : 'Expense';
    return this.isEditMode ? `Update ${noun}` : `Save ${noun}`;
  }

  private patchForm(): void {
    if (this.mode === 'expense' && this.expenseToEdit) {
      this.form.patchValue({
        tag:         this.expenseToEdit.category,
        description: this.expenseToEdit.description,
        amount:      this.expenseToEdit.amount,
        date:        this.datePipe.transform(this.expenseToEdit.date, 'yyyy-MM-dd'),
      });
    }

    if (this.mode === 'income' && this.incomeToEdit) {
      this.form.patchValue({
        tag:         this.incomeToEdit.source,
        description: this.incomeToEdit.description,
        amount:      this.incomeToEdit.amount,
        date:        this.datePipe.transform(this.incomeToEdit.date, 'yyyy-MM-dd'),
      });
    }
  }

}
