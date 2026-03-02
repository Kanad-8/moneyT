package com.project.MoneyT.dto.budgetDTO;

public class RiskyBudgetResponse {
    private String category;
    private Double percentage;


    public RiskyBudgetResponse(String category,Double percentage) {
        this.category=category;
        this.percentage=percentage;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
}
