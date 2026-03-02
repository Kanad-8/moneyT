import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Observable, skip, Subject, takeUntil, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

import { ModalService }             from '../../services/modal-service';
import { ExpenseService }           from '../../services/expense-service';
import { IncomeService }            from '../../services/income-service';

import { Expenses }                 from '../../../../core/models/ExpenseModel/expense.model';
import { Income }                   from '../../../../core/models/IncomeModel/IncomeResponse';
import { TransactionListItem }      from '../../../../core/models/TransactionItemList';
import { FilterState }              from '../../../../core/models/FilterState';

import { TransactionForm }          from '../../components/transaction-form/transaction-form';
import { TransactionListComponent } from '../../../dashboard/components/transaction-list-component/transaction-list-component';
import { StatCard }                 from '../../components/stat-card/stat-card';
import { CategoryChart }            from '../../components/category-chart/category-chart';
import { FilterBar }                from '../../components/filter-bar/filter-bar';
import { ViewAllExpensesModal }     from '../../components/view-all-expenses-modal/view-all-expenses-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';


export type ActiveTab = 'expense' | 'income';

@Component({
  selector: 'app-expense-page',
  standalone: true,
  imports: [
    AsyncPipe,
    TransactionForm,
    TransactionListComponent,
    StatCard,
    CategoryChart,
    FilterBar,
    ViewAllExpensesModal,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './expense-page.html',
  styleUrl:    './expense-page.scss',
})
export class ExpensePage implements OnInit ,OnDestroy{

  private destroy$ = new Subject<void>();

  // ── Tab ───────────────────────────────────────────────────────────────────
  activeTab: ActiveTab = 'expense';

  // ── Lists ─────────────────────────────────────────────────────────────────
  expenses: TransactionListItem[] = [];
  incomes:  TransactionListItem[] = [];
  totalExpenseItems = 0;
  totalIncomeItems =0;

  // ── Pagination / filters ──────────────────────────────────────────────────
  currentPage    = 1;
  pageSize       = 10;
  currentFilters: FilterState | null = null;

  // ── Stats ─────────────────────────────────────────────────────────────────
  chartLabels: string[] = [];
  chartData:   number[] = [];
  totalAmount  = 0;
  totalIncome  = 0;

  // ── Modals ────────────────────────────────────────────────────────────────
  isExpenseModalOpen$: Observable<boolean>;
  isIncomeModalOpen$:  Observable<boolean>;
  isViewAllModalOpen$: Observable<boolean>;

  expenseToEdit: Expenses | null = null;
  incomeToEdit:  Income   | null = null;

  constructor(
    private expenseService: ExpenseService,
    private incomeService:  IncomeService,
    private expenseModal:   ModalService,
    private router:Router
  ) {
    this.isExpenseModalOpen$ = this.expenseModal.isExpenseModalOpen$;
    this.isIncomeModalOpen$  = this.expenseModal.isIncomeModalOpen$;
    this.isViewAllModalOpen$ = this.expenseModal.isViewAllOpne$;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.expenseService.expenseList$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.expenses = this.mapExpensesToItems(data);
    });

    this.expenseService.total$.pipe(takeUntil(this.destroy$)).subscribe(total => {
      this.totalExpenseItems = total;
    });

    this.incomeService.incomeList$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.incomes = this.mapIncomesToItems(data);
    });

    this.incomeService.total$.pipe(takeUntil(this.destroy$)).subscribe(total =>{
      this.totalIncomeItems = total;
    })

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      skip(1),
      takeUntil(this.destroy$))
      .subscribe(() => {
       this.resetPageState();
       this.loadData();
      });

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Tab switching ─────────────────────────────────────────────────────────
  switchTab(tab: ActiveTab): void {
    this.activeTab     = tab;
    this.currentPage   = 1;
    this.currentFilters = null;   // reset filters when switching tabs
    this.loadData();
  }

  // ── Data loading ──────────────────────────────────────────────────────────
  loadData(): void {
  const filters = this.currentFilters ?? undefined;

  // FIX 3: only call the API relevant to the active tab
  if (this.activeTab === 'expense') {
    this.expenseService.loadExpenses(this.currentPage, this.pageSize, filters);
  }

  if (this.activeTab === 'income') {
    this.incomeService.loadIncomes( 
      this.currentPage,
      this.pageSize,
      this.toIncomeFilters(filters),
    );
  }

  this.loadStatData();
}

  loadStatData(): void {
    this.expenseService.getStats(this.currentFilters || undefined).pipe(takeUntil(this.destroy$)).subscribe(stats => {
      this.chartLabels = stats.categoryBreakdown.map(c => c.categoryName);
      this.chartData   = stats.categoryBreakdown.map(c => c.percentage);
      this.totalAmount = stats.totalAmount;
    });

    this.incomeService.getTotalIncome().pipe(takeUntil(this.destroy$)).subscribe(total => {
      this.totalIncome = total;
    });
  }

  private resetPageState(): void {
  this.currentPage    = 1;
  this.currentFilters = null;
  this.activeTab      = 'expense';
}

  handleFilter(filters: FilterState): void {
    this.currentFilters = filters;
    this.currentPage    = 1;
    this.loadData();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  // ── Expense CRUD ──────────────────────────────────────────────────────────
  openAddExpense(): void {
    this.expenseToEdit = null;
    this.expenseModal.openExpenseModal();
  }

  onEditExpenseModal(item: TransactionListItem): void {
    this.expenseToEdit = new Expenses(
      item.transaction_id,
      item.title, item.subtitle,
      item.amount, item.date
    );
    this.expenseModal.openExpenseModal();
  }

  onExpenseModalClose(): void {
    this.expenseModal.closeExpenseModal();
    this.expenseToEdit = null;
  }

  handleSaveExpense(expense:Expenses): void {
    this.expenseService.saveExpense(expense).subscribe({
      next:  () => { this.onExpenseModalClose(); this.loadData(); },
      error: () => alert('Failed to save expense. Please try again.'),
    });
  }

  onDeleteExpense(item: TransactionListItem): void {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    this.expenseService.deleteExpense(item.transaction_id).subscribe({
      next:  () => this.loadData(),
      error: () => alert('Could not delete expense.'),
    });
  }

  // ── Income CRUD ───────────────────────────────────────────────────────────
  openAddIncome(): void {
    this.incomeToEdit = null;
    this.expenseModal.openIncomeModal();
  }

  onEditIncomeModal(item: TransactionListItem): void {
    this.incomeToEdit = new Income(
      item.transaction_id,
      item.title,
      item.subtitle,
      item.amount,
      item.date);
    this.expenseModal.openIncomeModal();
  }

  onIncomeModalClose(): void {
    this.expenseModal.closeIncomeModal();
    this.incomeToEdit = null;
  }

  handleSaveIncome(income: Income): void {
    this.incomeService.saveIncome(income).subscribe({
      next:  () => { this.onIncomeModalClose(); this.loadData(); },
      error: () => alert('Failed to save income. Please try again.'),
    });
  }

  onDeleteIncome(item: TransactionListItem): void {
    if (!confirm('Are you sure you want to delete this income entry?')) return;
    this.incomeService.deleteIncome(item.transaction_id).subscribe({
      next:  () => this.loadData(),
      error: () => alert('Could not delete income.'),
    });
  }

  // ── View-all modal ────────────────────────────────────────────────────────
  onViewAllModal(): void { this.expenseModal.openViewAll(); }
  onViewAllClose(): void { this.expenseModal.closeViewAll(); }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Map a generic FilterState to income-specific filters.
   *  'category' becomes 'source' for income queries. */
  private toIncomeFilters(filters: FilterState | undefined): any {
    if (!filters) return undefined;
    const { category, ...rest } = filters as any;
    return { ...rest, source: category };   // rename the field
  }

  private mapExpensesToItems(expenses: Expenses[]): TransactionListItem[] {
    return expenses.map(e => ({
      transaction_id: e.id ?? 0,
      title:          e.category,
      subtitle:       e.description,
      amount:         e.amount,
      date:           e.date,
    }));
  }

  private mapIncomesToItems(incomes: Income[]): TransactionListItem[] {
    return incomes.map(i => ({
      transaction_id: i.id ?? 0,
      title:          i.source,
      subtitle:       i.description,
      amount:         i.amount,
      date:           i.date,
    }));
  }
}