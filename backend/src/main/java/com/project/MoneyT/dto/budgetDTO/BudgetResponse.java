package com.project.MoneyT.dto.budgetDTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data
public class BudgetResponse {

    private Long id;
    private String category;
    private BigDecimal limitAmount;

    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private Double percentageUsed;
    private boolean isOverBudget;
}
