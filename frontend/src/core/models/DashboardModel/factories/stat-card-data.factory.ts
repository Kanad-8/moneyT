import { StatCardData } from "../StatCardData";
import { StatTrend } from "../../../../features/dashboard/components/stat-card1/stat-card1";


export function createDefaultStatCardData(): StatCardData {
  const emptyTrend: StatTrend = { type: 'stable', label: '', text: '' };

  return {
    totalIncome:       { title: 'Total Income',        icon: 'savings',                 colorClass: 'green',  value: 0,  currency: true,  trend: { ...emptyTrend } },
    totalSpent:        { title: 'Total Spent',          icon: 'account_balance_wallet',  colorClass: 'blue',   value: 0,  currency: true,  trend: { ...emptyTrend } },
    netSaving:         { title: 'Net Saving',           icon: 'account_balance',         colorClass: 'blue',   value: 0,  currency: true,  trend: { ...emptyTrend } },
    dailyAverage:      { title: 'Daily Average',        icon: 'calendar_today',          colorClass: 'yellow', value: 0,  currency: true,  unit: '/day', trend: { ...emptyTrend } },
    savingsRate:       { title: 'Savings Rate',         icon: 'savings',                 colorClass: 'green',  value: '0%',               trend: { ...emptyTrend } },
    biggestSpike:      { title: 'Biggest Spike',        icon: 'trending_up',             colorClass: 'red',    value: '—', secondaryText: '',
                         progress: { value: 0, variant: 'normal', left: '', center: '', right: '' } },
    safeDailyAllowance:{ title: 'Safe Daily Allowance', icon: 'speed',                  colorClass: 'yellow', value: 0,  currency: true,  unit: '/day', secondaryText: '', trend: { ...emptyTrend } },
  };
}