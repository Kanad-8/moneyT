package com.project.MoneyT.dto.incomeDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MonthlyTrendResponse {
    private int month;
    private int year;
    private BigDecimal amount;

    public MonthlyTrendResponse(int year,int month,BigDecimal amount){
        this.year= year;
        this.month= month;
        this.amount=amount;
    }
}

