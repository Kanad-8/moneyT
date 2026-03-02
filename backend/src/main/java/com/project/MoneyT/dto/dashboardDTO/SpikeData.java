package com.project.MoneyT.dto.dashboardDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class SpikeData {
    private BigDecimal spike;
    private BigDecimal percentage;
    private String category;
}
