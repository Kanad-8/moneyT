package com.project.MoneyT.dto.dashboardDTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Builder
@Data
public class MonthlyCashFlowResponse {

    private String monthLabel;

    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal netBalance;

    private int year;
    private int month;

}
