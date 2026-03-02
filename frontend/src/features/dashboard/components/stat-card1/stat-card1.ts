import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface StatTrend {
  /**
   * 'up'     → arrow up   → red badge   (spending rose = bad)
   * 'down'   → arrow down → green badge (spending fell = good)
   * 'stable' → dash       → grey badge
   *
   * For INCOME or NET cards pass trendPositive=true on the host —
   * then 'up' renders green (more income = good).
   */
  type: 'up' | 'down' | 'stable' | string;
  /** Badge text, e.g. '12.5%' or '+₹2,100' */
  label: string;
  /** Supporting line under the badge */
  text?: string;
}

export interface StatProgress {
  value: number;                    // 0–100
  variant?: 'normal' | 'danger';
  left?: string;
  center?: string;
  right?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card1.html',
  styleUrl:    './stat-card1.scss',
})
export class StatCard1 implements OnChanges {

  // ── Appearance ─────────────────────────────────────────────────────────────

  /** 'hero' → larger value + accent border stripe (use for top 3 KPIs)
   *  'secondary' → standard size (use for supporting metrics)       */
  @Input() variant: 'hero' | 'secondary' = 'secondary';

  @Input() title!:      string;
  @Input() icon!:       string;
  @Input() colorClass:  'blue' | 'green' | 'yellow' | 'red' | 'purple' = 'blue';

  // ── Value ───────────────────────────────────────────────────────────────────

  @Input() value:     number | string = 0;
  @Input() currency   = false;
  @Input() unit?:     string;

  // ── Trend ───────────────────────────────────────────────────────────────────

  @Input() trend?: StatTrend;

  /**
   * Set to TRUE for income / net-saving cards so that an upward trend
   * renders GREEN (more money in = good) instead of red.
   */
  @Input() trendPositive = false;

  // ── Extras ──────────────────────────────────────────────────────────────────

  @Input() secondaryText?: string;
  @Input() progress?:      StatProgress;

  // ─── Derived ─────────────────────────────────────────────────────────────

  /** CSS class applied to the trend badge */
  trendClass = 'badge-stable';

  ngOnChanges(): void {
    this.trendClass = this.resolveTrendClass();
  }

  private resolveTrendClass(): string {
    const type = this.trend?.type;
    if (!type || type === 'stable') return 'badge-stable';

    if (this.trendPositive) {
      // Income / Net cards: up = green, down = red
      return type === 'up' ? 'income-up' : 'badge-up';
    }

    // Expense cards: up = red (bad), down = green (good)
    return type === 'up' ? 'badge-up' : 'badge-down';
  }
}