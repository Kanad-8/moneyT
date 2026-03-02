package com.project.MoneyT.dto.dashboardDTO;

import com.project.MoneyT.service.DashboardService;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProjectedMonTotal {
    private BigDecimal totalPredicted ;
    private BigDecimal totalBudget ;
    private BigDecimal difference;
    private BigDecimal netBalance;

    public ProjectedMonTotal(BigDecimal totalPredicted , BigDecimal totalBudget , BigDecimal difference,BigDecimal netBalance){
        this.totalPredicted=totalPredicted;
        this.totalBudget=totalBudget;
        this.difference= difference;
        this.netBalance=netBalance;
    }
}
