import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  OnChanges,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { TransactionListItem, TransactionMode } from '../../../../core/models/TransactionItemList';

// ─── Icon / colour maps (unchanged) ──────────────────────────────────────────

const EXPENSE_ICON_MAP: Record<string, string> = {
  groceries: 'shopping_cart', food: 'shopping_cart',
  transport: 'train', 'bus fare': 'directions_bus', 'train ticket': 'train',
  utilities: 'lightbulb', 'electricity bill': 'lightbulb', 'gas bill': 'local_fire_department',
  entertainment: 'theaters', 'cinema tickets': 'theaters',
  'dinner out': 'restaurant',
  health: 'favorite', medical: 'local_hospital',
  shopping: 'shopping_bag', rent: 'home', education: 'school',
  housing: 'home',
};

const EXPENSE_BG_MAP: Record<string, string> = {
  groceries: '#e0e7ff', food: '#e0e7ff',
  transport: '#d1fae5', 'bus fare': '#d1fae5', 'train ticket': '#d1fae5',
  utilities: '#fef3c7', 'electricity bill': '#fef3c7', 'gas bill': '#fef3c7',
  entertainment: '#f3e8ff', 'cinema tickets': '#f3e8ff',
  'dinner out': '#fee2e2',
  health: '#ffe4e6', medical: '#ffe4e6',
  shopping: '#e0e7ff', rent: '#fef9c3', education: '#dbeafe',
  housing: '#fef9c3',
};

const EXPENSE_ICON_COLOR_MAP: Record<string, string> = {
  groceries: '#4f46e5', food: '#4f46e5',
  transport: '#059669', 'bus fare': '#059669', 'train ticket': '#059669',
  utilities: '#d97706', 'electricity bill': '#d97706', 'gas bill': '#d97706',
  entertainment: '#9333ea', 'cinema tickets': '#9333ea',
  'dinner out': '#dc2626',
  health: '#e11d48', medical: '#e11d48',
  shopping: '#4f46e5', rent: '#ca8a04', education: '#2563eb',
  housing: '#ca8a04',
};

const INCOME_ICON_MAP: Record<string, string> = {
  salary: 'payments', freelance: 'laptop_mac',
  investment: 'trending_up', dividend: 'show_chart',
  rental: 'home', bonus: 'star', business: 'storefront',
  gift: 'redeem', refund: 'currency_exchange',
  interest: 'account_balance', other: 'attach_money',
};

const INCOME_BG_MAP: Record<string, string> = {
  salary: '#d1fae5', freelance: '#dcfce7', investment: '#d1fae5',
  dividend: '#dcfce7', rental: '#d1fae5', bonus: '#dcfce7',
  business: '#d1fae5', gift: '#dcfce7', refund: '#d1fae5',
  interest: '#dcfce7', other: '#d1fae5',
};

const INCOME_ICON_COLOR_MAP: Record<string, string> = {
  salary: '#059669', freelance: '#047857', investment: '#059669',
  dividend: '#047857', rental: '#059669', bonus: '#047857',
  business: '#059669', gift: '#047857', refund: '#059669',
  interest: '#047857', other: '#059669',
};

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-transaction-list-component',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, TitleCasePipe],
  templateUrl: './transaction-list-component.html',
  styleUrl:    './transaction-list-component.scss',
})
export class TransactionListComponent implements OnChanges {

  // ── Existing inputs ────────────────────────────────────────────────────────
  @Input() mode:  TransactionMode          = 'expense';
  @Input() title                           = '';
  @Input() items: TransactionListItem[] | null = [];

  // ── Pagination inputs ──────────────────────────────────────────────────────
  /** Current active page (1-based) */
  @Input() currentPage = 1;

  /** Total number of records across ALL pages (from backend) */
  @Input() totalItems  = 0;

  /** How many rows per page */
  @Input() pageSize    = 10;

  // ── Outputs ───────────────────────────────────────────────────────────────
  @Output() edit       = new EventEmitter<TransactionListItem>();
  @Output() delete     = new EventEmitter<TransactionListItem>();
  @Output() viewAll    = new EventEmitter<void>();

  /** Emits the new page number when user clicks prev/next/page button */
  @Output() pageChange = new EventEmitter<number>();

  @HostBinding('attr.mode') get modeAttr() { return this.mode; }

  // ── Derived pagination state ───────────────────────────────────────────────

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get hasPrev(): boolean { return this.currentPage > 1; }
  get hasNext(): boolean { return this.currentPage < this.totalPages; }

  get startItem(): number {
    if (this.totalItems === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  /** Visible page number buttons — max 5, centred around currentPage */
  get pageNumbers(): number[] {
    const total  = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - 2);
    let end   = Math.min(total, start + maxVisible - 1);

    // Shift window left if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }

  onEdit(item: TransactionListItem):   void { this.edit.emit(item); }
  onDelete(item: TransactionListItem): void { this.delete.emit(item); }
  onViewAll():                         void { this.viewAll.emit(); }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] && !this.title) {
      this.title = this.mode === 'income' ? 'Recent Income' : 'Recent Transactions';
    }
    if (changes['title'] && !changes['title'].currentValue) {
      this.title = this.mode === 'income' ? 'Recent Income' : 'Recent Transactions';
    }
  }

  // ── Icon helpers ──────────────────────────────────────────────────────────

  getIcon(key: string): string {
    const k = (key ?? '').toLowerCase();
    return this.mode === 'income'
      ? (INCOME_ICON_MAP[k]      ?? 'attach_money')
      : (EXPENSE_ICON_MAP[k]     ?? 'receipt_long');
  }

  getIconBg(key: string): string {
    const k = (key ?? '').toLowerCase();
    return this.mode === 'income'
      ? (INCOME_BG_MAP[k]        ?? '#d1fae5')
      : (EXPENSE_BG_MAP[k]       ?? '#e5e7eb');
  }

  getIconColor(key: string): string {
    const k = (key ?? '').toLowerCase();
    return this.mode === 'income'
      ? (INCOME_ICON_COLOR_MAP[k] ?? '#059669')
      : (EXPENSE_ICON_COLOR_MAP[k] ?? '#4b5563');
  }
}