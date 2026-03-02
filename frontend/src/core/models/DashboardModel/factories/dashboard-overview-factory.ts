import { DashboardOverview } from '../DashboardOverview';

export function createDefaultDashboardOverview(): DashboardOverview {
  return {

    stats: {
      totalSpentC:             0,
      totalSpentP:             0,
      totalRemaining:          0,
      transactionCount:        0,
      averageTransactionP:     0,
      averageTransactionC:     0,
      categorySpike:           '',
      categorySpikeAmt:        0,
      categorySpikePercentage: 0,
      percentage:              0,
      dailySafeLimit:          0,
      savingsRate:             0,
      totalIncome:             0,
      netSavings:              0,
    },

    budgetSummary: {
      totalBudgeted: 0,
      totalSpent:    0,
      remaining:     0,
    },

    projectedMonTotal: {
      totalPredicted: 0,
      totalBudget:    0,
      difference:     0,
    },

    categoryBreakdown:     [],
    recentTransactions:    [],
    recentIncomes:         [],
    monthlyCashFlowResponse: [],
  };
}