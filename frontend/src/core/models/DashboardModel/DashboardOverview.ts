import { MonthlyCashFlowTrendCard } from "../../../features/dashboard/components/monthly-cash-flow-trend-card/monthly-cash-flow-trend-card";
import { ExpenseForm } from "../../../features/expenses/components/expense-form/expense-form";
import { Expenses } from "../ExpenseModel/expense.model";
import { TransactionListItem } from "../TransactionItemList";
import { MonthlyCashFlowResponse } from "./MonthlyCashFlowResponse";
import { Income } from "../IncomeModel/IncomeResponse";

export interface DashboardOverview{

    stats:{
        totalSpentC:number;
        totalSpentP:number;
        percentage:number;

        categorySpike:String;
        categorySpikeAmt:number;
        categorySpikePercentage:number;

        totalRemaining:number;
        transactionCount:number;

        averageTransactionC:number;
        averageTransactionP:number;

        dailySafeLimit:number;
        totalIncome:number;

        savingsRate:number;
        netSavings:number;
        
    }

    recentTransactions:Expenses[];
    recentIncomes:Income[];
    monthlyCashFlowResponse:MonthlyCashFlowResponse[];

    budgetSummary:{
        totalBudgeted:number;
        totalSpent:number;
        remaining:number;
    }

    categoryBreakdown:{
        categoryName:string;
        percentage:number;
    }[];

    projectedMonTotal:{
        totalPredicted:number;
        totalBudget:number;
        difference:number;
    }
}