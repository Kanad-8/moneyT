package com.project.MoneyT.dto.budgetDTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data
public class BudgetRequest {
    private String category;
    private BigDecimal limitAmount;
    private String month;
    private Integer year;
}
