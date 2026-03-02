package com.project.MoneyT.dto.expenseDTO;

import com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

public class ExpenseDashboardResponse {
    private BigDecimal totalAmount;
    private BigDecimal averageTransaction;
    private Long count;
    private List<CategoryBreakdownResponse> categoryBreakdown;

    public ExpenseDashboardResponse() {

    }

    public ExpenseDashboardResponse(BigDecimal totalAmount, Double averageTransaction, Long count){
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


    public List<CategoryBreakdownResponse> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryBreakdownResponse> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
