package com.project.MoneyT.dto.incomeDTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class IncomeRequest {
    private String source;
    private String description;
    private BigDecimal amount;
    private LocalDate date;
}
