package com.project.MoneyT.dto.budgetDTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class BudgetSummaryResponse {
    private BigDecimal totalBudgeted;
    private BigDecimal totalSpent;
    private BigDecimal totalRemaining;

    public BudgetSummaryResponse(BigDecimal totalBudgeted,BigDecimal totalSpent,BigDecimal totalRemaining){
        this.totalBudgeted=totalBudgeted;
        this.totalRemaining=totalRemaining;
        this.totalSpent=totalSpent;
    }

}
