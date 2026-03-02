package com.project.MoneyT.dto.incomeDTO;

import com.project.MoneyT.service.IncomeService;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class IncomeSourceBreakdownResponse {
    private String source;
    private BigDecimal amount;

    public IncomeSourceBreakdownResponse(String source,BigDecimal amount){
        this.source=source;
        this.amount=amount;
    }
}
