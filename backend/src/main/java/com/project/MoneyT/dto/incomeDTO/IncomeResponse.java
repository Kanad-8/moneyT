package com.project.MoneyT.dto.incomeDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IncomeResponse {
    private Long id;
    private String source;
    private String description;
    private BigDecimal amount;
    private LocalDate date;
    private String createdAt;
}
