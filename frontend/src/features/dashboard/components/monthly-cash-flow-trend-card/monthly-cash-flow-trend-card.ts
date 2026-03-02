import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  registerables,
} from 'chart.js';

import { MonthlyCashFlowResponse } from '../../../../core/models/DashboardModel/MonthlyCashFlowResponse';

Chart.register(...registerables);
type ChartMode = 'bar' | 'line' | 'net';

@Component({
  selector: 'app-monthly-cash-flow-trend-card',
  imports: [CommonModule],
  templateUrl: './monthly-cash-flow-trend-card.html',
  styleUrl: './monthly-cash-flow-trend-card.scss',
})
export class MonthlyCashFlowTrendCard
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() data: MonthlyCashFlowResponse[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  activeMode: ChartMode = 'bar';
  private chart: Chart | null = null;

  get totalIncome(): number {
    return this.data?.reduce((s, d) => s + Number(d.income), 0) ?? 0;
  }

  get totalExpense(): number {
    return this.data?.reduce((s, d) => s + Number(d.expense), 0) ?? 0;
  }

  get totalNet(): number {
    return this.data?.reduce((s, d) => s + Number(d.netBalance), 0) ?? 0;
  }

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.buildChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  switchMode(mode: ChartMode): void {
    this.activeMode = mode;
    this.buildChart();
  }

  private buildChart(): void {
    if (!this.chartCanvas) return;
    this.chart?.destroy();

    const sorted = [...(this.data ?? [])].sort(
      (a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month
    );

    const labels = sorted.map((d) => d.monthLabel);
    const incomes = sorted.map((d) => Number(d.income));
    const expenses = sorted.map((d) => Number(d.expense));
    const nets = sorted.map((d) => Number(d.netBalance));

    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    const config = this.buildConfig(labels, incomes, expenses, nets, ctx);
    this.chart = new Chart(ctx, config);
  }

  private buildConfig(
    labels: string[],
    incomes: number[],
    expenses: number[],
    nets: number[],
    ctx: CanvasRenderingContext2D
  ): ChartConfiguration {
    const greenGrad = ctx.createLinearGradient(0, 0, 0, 260);
    greenGrad.addColorStop(0, 'rgba(34,197,94,0.18)');
    greenGrad.addColorStop(1, 'rgba(34,197,94,0.02)');

    const redGrad = ctx.createLinearGradient(0, 0, 0, 260);
    redGrad.addColorStop(0, 'rgba(244,63,94,0.18)');
    redGrad.addColorStop(1, 'rgba(244,63,94,0.02)');

    const blueGrad = ctx.createLinearGradient(0, 0, 0, 260);
    blueGrad.addColorStop(0, 'rgba(99,102,241,0.2)');
    blueGrad.addColorStop(1, 'rgba(99,102,241,0.02)');

    const commonOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            borderRadius: 5,
            useBorderRadius: true,
            padding: 16,
            font: { size: 12, family: "'Segoe UI', system-ui, sans-serif", weight: 600 },
            color: '#6b7280',
          },
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f9fafb',
          bodyColor: '#d1d5db',
          padding: 12,
          cornerRadius: 10,
          titleFont: { weight: 'bold', size: 13 },
          callbacks: {
            label: (ctx) => ` ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#9ca3af',
            font: { size: 11, family: "'Segoe UI', system-ui, sans-serif" },
          },
        },
        y: {
          grid: { color: '#f3f4f6' },
          border: { display: false, dash: [4, 4] },
          ticks: {
            color: '#9ca3af',
            font: { size: 11, family: "'Segoe UI', system-ui, sans-serif" },
            callback: (v) => '₹' + Number(v).toLocaleString('en-IN'),
          },
        },
      },
    };

    if (this.activeMode === 'bar') {
      return {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Income',
              data: incomes,
              backgroundColor: 'rgba(34,197,94,0.75)',
              borderRadius: 6,
              borderSkipped: false,
            },
            {
              label: 'Expense',
              data: expenses,
              backgroundColor: 'rgba(244,63,94,0.75)',
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          ...commonOptions,
          scales: {
            ...commonOptions!.scales,
            x: { ...commonOptions!.scales?.['x'], stacked: false },
            y: { ...commonOptions!.scales?.['y'] },
          },
        },
      };
    }

    if (this.activeMode === 'line') {
      return {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Income',
              data: incomes,
              borderColor: '#22c55e',
              backgroundColor: greenGrad,
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: '#22c55e',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Expense',
              data: expenses,
              borderColor: '#f43f5e',
              backgroundColor: redGrad,
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: '#f43f5e',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: commonOptions,
      };
    }

    // net mode
    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Net Balance',
            data: nets,
            borderColor: '#6366f1',
            backgroundColor: blueGrad,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: nets.map((n) => n >= 0 ? '#6366f1' : '#f43f5e'),
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        ...commonOptions,
        plugins: {
          ...commonOptions!.plugins,
          tooltip: {
            ...commonOptions!.plugins?.tooltip,
            callbacks: {
              label: (ctx) => {
                const val = Number(ctx.parsed.y);
                return ` ${val >= 0 ? '+' : ''}₹${val.toLocaleString('en-IN')}`;
              },
            },
          },
        },
      },
    };
  }
}
