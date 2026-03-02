package com.project.MoneyT.dto.dashboardDTO;



import lombok.Data;
import java.math.BigDecimal;
import java.util.function.BiFunction;


@Data
public class StatsDto {
    private BigDecimal totalSpentC;
    private BigDecimal totalSpentP;
    private BigDecimal percentage;
    private BigDecimal totalIncome;

    private String categorySpike;
    private BigDecimal categorySpikeAmt;
    private BigDecimal categorySpikePercentage;


    private BigDecimal totalRemaining;
    private Long transactionCount;

    private BigDecimal averageTransactionC;
    private BigDecimal averageTransactionP;

    private BigDecimal dailySafeLimit;
    private Long savingsRate;
    private BigDecimal netSavings;

    public StatsDto(BigDecimal totalSpentC, BigDecimal totalSpentP, BigDecimal percentage,BigDecimal totalIncome,
                    String categorySpike, BigDecimal categorySpikeAmt, BigDecimal categorySpikePercentage,
                    BigDecimal totalRemaining, Long transactionCount,
                    BigDecimal averageTransactionC, BigDecimal averageTransactionP,
                    BigDecimal dailySafeLimit,Long savingsRate,BigDecimal netSavings) {
        this.totalSpentC = totalSpentC;
        this.totalSpentP = totalSpentP;
        this.percentage = percentage;
        this.totalIncome=totalIncome;
        this.categorySpike = categorySpike;
        this.categorySpikeAmt = categorySpikeAmt;
        this.categorySpikePercentage = categorySpikePercentage;
        this.totalRemaining = totalRemaining;
        this.transactionCount = transactionCount;
        this.averageTransactionC = averageTransactionC;
        this.averageTransactionP = averageTransactionP;
        this.dailySafeLimit = dailySafeLimit;
        this.savingsRate=savingsRate;
        this.netSavings= netSavings;
    }


}
