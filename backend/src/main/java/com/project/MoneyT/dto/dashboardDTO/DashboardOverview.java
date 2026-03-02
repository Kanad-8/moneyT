package com.project.MoneyT.dto.dashboardDTO;


import com.project.MoneyT.dto.expenseDTO.ExpenseResponse;
import com.project.MoneyT.dto.budgetDTO.BudgetSummaryResponse;
import com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse;
import com.project.MoneyT.dto.incomeDTO.IncomeResponse;
import com.project.MoneyT.dto.incomeDTO.IncomeSourceBreakdownResponse;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardOverview {
    private StatsDto stats;
    private List<ExpenseResponse> recentTransactions;
    private List<IncomeResponse> recentIncomes;
    private BudgetSummaryResponse budgetSummary;
    private List<CategoryBreakdownResponse> categoryBreakdown;
    private ProjectedMonTotal projectedMonTotal;
    private List<MonthlyCashFlowResponse> monthlyCashFlowResponse;
    private List<IncomeSourceBreakdownResponse> incomeSourceBreakdownResponsesList;
}
