package com.project.MoneyT.dto.expenseDTO;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class ExpenseStatsResponse {

    private BigDecimal totalAmount;
    private BigDecimal averageTransaction;
    private Long count;


    public ExpenseStatsResponse(BigDecimal totalAmount, Double averageTransaction, Long count) {
        this.totalAmount = totalAmount == null? BigDecimal.ZERO :totalAmount;
        this.averageTransaction= averageTransaction == null? BigDecimal.ZERO : BigDecimal.valueOf(averageTransaction).setScale(2, RoundingMode.HALF_UP);
        this.count = count == null ? 0L : count;
    }


    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getAverageTransaction() {
        return averageTransaction;
    }

    public void setAverageTransaction(BigDecimal averageTransaction) {
        this.averageTransaction = averageTransaction;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
