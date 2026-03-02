package com.project.MoneyT.dto.budgetDTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class CategoryBreakdownResponse {

    private String categoryName;
    private BigDecimal percentage;

    public CategoryBreakdownResponse(String categoryName, BigDecimal percentage){
        this.categoryName=categoryName;
        this.percentage = percentage;
    }


}
