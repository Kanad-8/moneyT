package com.project.MoneyT.dto.expenseDTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseRequest {

    private String category;
    private String description;
    private BigDecimal amount;
    private LocalDate date;


}
