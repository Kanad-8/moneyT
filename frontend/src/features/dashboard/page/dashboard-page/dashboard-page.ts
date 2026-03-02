import { Component, OnInit } from '@angular/core';
import { MonthlyCashFlowResponse } from '../../../../core/models/DashboardModel/MonthlyCashFlowResponse';
import { SpendingCategoryCard } from "../../components/spending-category-card/spending-category-card";

import { OverallMonthlyBudgetCard } from "../../components/overall-monthly-budget-card/overall-monthly-budget-card";
import { MonthlyBudget } from '../../../../core/models/BudgetModel/MonthlyBudget';
import { ExpensePage } from '../../../expenses/page/expense-page/expense-page';
import { Expenses } from '../../../../core/models/ExpenseModel/expense.model';
import { BudgetSummary } from '../../../../core/models/BudgetModel/BudgetSummary';
import { DashboardOverview } from '../../../../core/models/DashboardModel/DashboardOverview';
import { DashboardService } from '../../services/dashboard-service';
import { StatCard1 } from "../../components/stat-card1/stat-card1";
import { ProjectedForecastCard } from "../../components/projected-forecast-card/projected-forecast-card";
import { StatTrend } from '../../components/stat-card1/stat-card1';
import { StatCardData } from '../../../../core/models/DashboardModel/StatCardData';
import { StatProgress } from '../../components/stat-card1/stat-card1';
import { MonthlyCashFlowTrendCard } from '../../components/monthly-cash-flow-trend-card/monthly-cash-flow-trend-card';
import { TransactionListItem } from '../../../../core/models/TransactionItemList';
import { TransactionListComponent } from '../../components/transaction-list-component/transaction-list-component';
import { Income } from '../../../../core/models/IncomeModel/IncomeResponse';
import { retry } from 'rxjs';
import { createDefaultStatCardData } from '../../../../core/models/DashboardModel/factories/stat-card-data.factory';
import { createDefaultDashboardOverview } from '../../../../core/models/DashboardModel/factories/dashboard-overview-factory';

@Component({
  selector: 'app-dashboard-page',
  imports: [StatCard1, SpendingCategoryCard, OverallMonthlyBudgetCard, ProjectedForecastCard,MonthlyCashFlowTrendCard,TransactionListComponent],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit{

  StatCardData: StatCardData = createDefaultStatCardData();
  recentTransactions:TransactionListItem[]= [];
  recentIncomes:TransactionListItem[] = [];
  data :DashboardOverview = createDefaultDashboardOverview();
  chartData:{totalBudgeted:number,totalSpent:number,totalRemaining:number}={totalBudgeted:0,totalSpent:0,totalRemaining:0};

  loading = true;

  constructor(private dashboardService:DashboardService){}

  ngOnInit(): void {
    this.loadCurrentMonthData();
  }

  loadCurrentMonthData(){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const start = new Date(year,month,1);
    const end = new Date(year,month+1,0);

    

    const formatDate = (d:Date) => d.toLocaleDateString('en-CA').split('T')[0];


    this.dashboardService.getOverview(formatDate(start),formatDate(end))
    .subscribe({
      next:(respone) =>{
        this.data={...respone}
        
        this.chartData = {
          totalBudgeted: this.data.budgetSummary.totalBudgeted,
          totalSpent: this.data.budgetSummary.totalSpent,
          totalRemaining: (this.data.budgetSummary.totalBudgeted - this.data.budgetSummary.totalSpent)
        };
        this.loading=false;
        this.populate();
        
      },
      error:(err)=>{console.error("Dashboard failed",err)}
    });

    
  }
 
  populateTotalSpentStat() {
    this.StatCardData.totalSpent.value = this.data.stats.totalSpentC;
    var trend: StatTrend = {
      type: '',
      label: '',
      text: '',
    }

    var diff = this.data.stats.totalSpentC - this.data.stats.totalSpentP;

    if (diff > 0) trend.type = 'up';
    else if (diff < 0) trend.type = 'down';
    else trend.type = 'stable';

    var percentage = diff / this.data.stats.totalSpentP;

    trend.label = percentage.toFixed(2) + '%';

    trend.text = "vs ₹" + this.data.stats.totalSpentP + " last month";

    this.StatCardData.totalSpent.trend = trend;
    
  }

  populateSpikeCard() {
    this.StatCardData.biggestSpike.value = this.data.stats.categorySpike.toString();
    this.StatCardData.biggestSpike.secondaryText = "+₹ " + this.data.stats.categorySpikeAmt + " increase"

    var progress: StatProgress = {
      value: this.data.stats.categorySpikePercentage,
      variant: "danger",
      left: "Contributed " + this.data.stats.categorySpikePercentage + "% of total increase"
    }

    this.StatCardData.biggestSpike.progress = progress;

  }

  populateDailyAvg() {
    this.StatCardData.dailyAverage.value = this.data.stats.averageTransactionC;

    var trend: StatTrend = {
      type: '',
      label: '',
      text: '',
    }

    var diff = this.data.stats.averageTransactionC - this.data.stats.averageTransactionP;

    if (diff > 0) trend.type = 'up';
    else if (diff < 0) trend.type = 'down';
    else trend.type = 'stable';

    trend.label = diff.toFixed(2);
    trend.text = "vs ₹" + this.data.stats.averageTransactionP + " last month";
    this.StatCardData.dailyAverage.trend = trend;

  }

  populateSafeDaily() {
    this.StatCardData.safeDailyAllowance.value = this.data.stats.dailySafeLimit;
    this.StatCardData.safeDailyAllowance.secondaryText = "You are currently averaging ₹" + this.data.stats.averageTransactionC;

    var diff = (this.data.stats.averageTransactionC - this.data.stats.dailySafeLimit).toFixed(2);

    var trend: StatTrend = {
      type: '',
      label: '',
      text: '',
    }

    trend.text = "Reduce spend by ₹" + diff + "/day to meet budget."
    trend.type = 'down'
    trend.label = diff.toString();

    this.StatCardData.safeDailyAllowance.trend = trend;
  }

  populateTotalIncome() {
    const income = this.data.stats.totalIncome ?? 0;
    this.StatCardData.totalIncome.value = income;

    const trend: StatTrend = {
      type: income > 0 ? 'up' : 'stable',
      label: '',
      text: 'Total income this period',
    };
    this.StatCardData.totalIncome.trend = trend;
  }

  populateNetSaving() {
    const net = this.data.stats.netSavings;
    this.StatCardData.netSaving.value = net;
    const trend: StatTrend = {
      type: net > 0 ? 'up' : net < 0 ? 'down' : 'stable',
      label: `${Math.abs(net).toFixed(0)}`,
      text: net >= 0 ? 'You are saving this month' : 'You are over-spending',
    };
    this.StatCardData.netSaving.trend = trend;
  }

  populateExpenseList() {
    this.recentTransactions = this.mapToTransactionItem(this.data.recentTransactions);
    this.recentIncomes = this.mapToTransactionItem(this.data.recentIncomes);
  }

  populateSavingsRate(): void {
    const rate = this.data.stats.savingsRate ?? 0;
    this.StatCardData.savingsRate.value = rate+'%';

    const trend: StatTrend = {
      type: rate >= 20 ? 'up' : rate > 0 ? 'stable' : 'down',
      label: `${rate.toFixed(1)}%`,
      text: this.getSavingsRateText(rate),
    };

    this.StatCardData.savingsRate.trend = trend;
  }

  private getSavingsRateText(rate: number): string {
    if (rate >= 30) return 'Excellent — well above the 20% target';
    if (rate >= 20) return 'Good — you\'re hitting the 20% target';
    if (rate >= 10) return 'Fair — aim for 20% savings rate';
    if (rate > 0) return 'Low — try to reduce expenses this month';
    return 'No savings recorded this month';
  }

  populate() {
    this.populateDailyAvg();
    this.populateSafeDaily();
    this.populateSpikeCard();
    this.populateTotalSpentStat();
    this.populateTotalIncome();
    this.populateNetSaving();
    this.populateExpenseList();
    this.populateSavingsRate();
  }

  

  // ── Event handlers ────────────────────────────────────────────────────────
  onEditExpense(item: TransactionListItem) {  }
  onDeleteExpense(item: TransactionListItem) {  }
  onViewAllExpenses() {  }

  onEditIncome(item: TransactionListItem) {  }
  onDeleteIncome(item: TransactionListItem) {  }
  onViewAllIncome() {  }

  mapToTransactionItem(expenses: Expenses[]): TransactionListItem[];
  mapToTransactionItem(incomes: Income[]): TransactionListItem[];

  mapToTransactionItem(items: (Expenses | Income)[]): TransactionListItem[] {
    if (!items || items.length === 0) return [];
    return items.map((item) => {
      if ("category" in item) {
        // Expense
        return {
          transaction_id: item.id ?? 0,
          title: item.category,
          subtitle: item.description,
          amount: item.amount,
          date: item.date,
        };
      } else {
        // Income
        return {
          transaction_id: item.id ?? 0,
          title: item.source,
          subtitle: item.description,
          amount: item.amount,
          date: item.date,
        };
      }
    });
  }
}
