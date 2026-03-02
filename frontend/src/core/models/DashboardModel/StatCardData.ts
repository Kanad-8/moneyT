import { StatProgress,StatTrend } from "../../../features/dashboard/components/stat-card1/stat-card1"

export interface StatCardData{
totalSpent: {
    title:'Total Spent',
    icon: 'account_balance_wallet',
    colorClass: 'blue',
    value: number,
    currency: true,
    trend:StatTrend
  },

  biggestSpike: {
    title: 'Biggest Spike',
    icon: 'trending_up',
    colorClass: 'red',
    value: string,
    secondaryText:string,
    progress:StatProgress
  },

  dailyAverage: {
     title: 'Daily Average',
    icon: 'calendar_today',
    colorClass: 'yellow',
    value: number,
    currency: true,
    unit: '/day',
    trend: StatTrend
  },

  savingsRate: {
    title: 'Savings Rate',
    icon: 'savings',
    colorClass: 'green',
    value: string,
    trend: StatTrend
  },

  safeDailyAllowance: {
  title: 'Safe Daily Allowance',
  icon: 'speed',               
  colorClass: 'yellow',
  value: number,
  currency: true,
  unit: '/day',
  secondaryText: string
  trend: StatTrend
}

totalIncome: {
    title: 'Total Income',
    icon: 'savings',
    colorClass: 'green',
    value: number,
    currency: true,
    trend: StatTrend
  },

  netSaving: {
    title: 'Net Saving',
    icon: 'account_balance',
    colorClass: 'blue',
    value: number,
    currency: true,
    trend: StatTrend
  },
}
