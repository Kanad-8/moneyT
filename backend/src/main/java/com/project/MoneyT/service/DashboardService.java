package com.project.MoneyT.service;

import com.project.MoneyT.dto.budgetDTO.BudgetSummaryResponse;
import com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse;
import com.project.MoneyT.dto.dashboardDTO.DashboardOverview;
import com.project.MoneyT.dto.dashboardDTO.SpikeData;


import com.project.MoneyT.dto.dashboardDTO.MonthlyCashFlowResponse;
import com.project.MoneyT.dto.dashboardDTO.ProjectedMonTotal;
import com.project.MoneyT.dto.dashboardDTO.StatsDto;
import com.project.MoneyT.dto.expenseDTO.ExpenseResponse;
import com.project.MoneyT.dto.expenseDTO.ExpenseStatsResponse;
import com.project.MoneyT.dto.incomeDTO.IncomeRequest;
import com.project.MoneyT.dto.incomeDTO.IncomeResponse;
import com.project.MoneyT.dto.incomeDTO.IncomeSourceBreakdownResponse;
import com.project.MoneyT.dto.incomeDTO.MonthlyTrendResponse;
import com.project.MoneyT.repository.BudgetRepository;
import com.project.MoneyT.repository.ExpenseRepository;
import com.project.MoneyT.repository.IncomeRepository;
import com.project.MoneyT.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseService expenseService;
    private final IncomeRepository incomeRepository;
    private final BudgetService budgetService;
    private final BudgetRepository budgetRepository;
    private final IncomeService incomeService;

    private final Logger logger = Logger.getLogger("log");

    @Transactional(readOnly = true)
    public DashboardOverview getDashboardOverview(Long userId, LocalDate startDate, LocalDate endDate){

        DashboardOverview overview = new DashboardOverview();

        ExpenseStatsResponse expenseStats = expenseRepository.getStats(userId, startDate,endDate,null);
        BudgetSummaryResponse budgetSummaryResponse = budgetService.getBudgetSummary(userId,monthString(startDate.getMonth().getValue()),startDate.getYear());


        BigDecimal totalRemaining =budgetSummaryResponse.getTotalRemaining();
        Long transactionCount =expenseStats.getCount();

        BigDecimal[] totalSpentMoM = getMoMTotalSpentStats(userId,startDate.getMonth().getValue(),startDate.getYear());
        BigDecimal totalSpentC = totalSpentMoM[1];
        BigDecimal totalSpentP = totalSpentMoM[0];
        BigDecimal totalSpentPercentage = totalSpentMoM[2];

        SpikeData spikeData = getMoMCategorySpike(userId,startDate.getMonth().getValue(),startDate.getYear());
        String categorySpike = spikeData.getCategory();
        BigDecimal categorySpikeAmt = spikeData.getSpike();
        BigDecimal categorySpikePercentage = spikeData.getPercentage();
        BigDecimal averageTransactionC = expenseStats.getAverageTransaction();

        YearMonth ymC = YearMonth.of(startDate.getYear(),startDate.getMonth());
        YearMonth ymP = ymC.minusMonths(1);
        LocalDate startDateP = ymP.atDay(1);
        LocalDate endDateP = ymP.atEndOfMonth();

        BigDecimal totalIncome = incomeRepository.calculateTotalIncome(userId, startDate, endDate);
        ExpenseStatsResponse expenseStatsP = expenseRepository.getStats(userId, startDateP,endDateP,null);

        BigDecimal averageTransactionP = expenseStatsP.getAverageTransaction();
        BigDecimal dailySafeLimit=getDailySafeLimit(userId,startDate.getMonth().getValue(),startDate.getYear());
        Long savingsRate = incomeService.getSavingsRate(userId,ymC);
        BigDecimal netSavings = incomeService.getNetSavings(userId,ymC);

         StatsDto stats = new StatsDto(
                 totalSpentC,
                 totalSpentP,
                 totalSpentPercentage,
                 totalIncome,
                 categorySpike,
                 categorySpikeAmt,
                 categorySpikePercentage,
                 totalRemaining,
                 transactionCount,
                 averageTransactionC,
                 averageTransactionP,
                 dailySafeLimit,
                 savingsRate,
                 netSavings
         );

         List<IncomeResponse> recentIncomes = incomeService.getRecentIncome(userId,5);
         List<ExpenseResponse> recentTransactions = expenseService.getRecentTransactions(userId,5);
         List<CategoryBreakdownResponse> categoryBreakdown = expenseService.getCategoryBreakdown(userId,startDate,endDate);
         ProjectedMonTotal projectedMonTotal = getProjected(userId,startDate.getMonth().getValue(),startDate.getYear());
         List<IncomeSourceBreakdownResponse> incomeSourceBreakdownResponseList = incomeService.getIncomeSourceBreakdown(userId,ymC);
         List<MonthlyCashFlowResponse> monthlyCashFlowResponseList = getMonthlyCashFlow(userId,6);

         overview.setStats(stats);
         overview.setBudgetSummary(budgetSummaryResponse);
         overview.setRecentTransactions(recentTransactions);
         overview.setRecentIncomes(recentIncomes);
         overview.setCategoryBreakdown(categoryBreakdown);
         overview.setProjectedMonTotal(projectedMonTotal);
         overview.setMonthlyCashFlowResponse(monthlyCashFlowResponseList);
         overview.setIncomeSourceBreakdownResponsesList(incomeSourceBreakdownResponseList);

         return overview;

    }

    private List<MonthlyCashFlowResponse> getMonthlyCashFlow(Long userId,int monthsToLookBack){
        LocalDate start = LocalDate.now().minusMonths(monthsToLookBack).withDayOfMonth(1);
        YearMonth startYm = YearMonth.of(start.getYear(),start.getMonth());
        List<MonthlyTrendResponse> income = incomeRepository.getMonthlyIncomeTrend(userId,start);
        List<MonthlyTrendResponse> expense = expenseRepository.getMonthlyExpenseTrend(userId,start);

        Map<YearMonth,BigDecimal> incomeMap = income.stream()
                .collect(Collectors.toMap(
                        i->YearMonth.of(i.getYear(),i.getMonth()),
                        MonthlyTrendResponse::getAmount
                ));

        Map<YearMonth,BigDecimal> expenseMap = expense.stream()
                .collect(Collectors.toMap(
                        e ->YearMonth.of(e.getYear(),e.getMonth()),
                        MonthlyTrendResponse::getAmount
                ));

        List<MonthlyCashFlowResponse> cashFlowResponseList = Stream.iterate(startYm,m->m.plusMonths(1))
                .limit(monthsToLookBack)
                .map(ym -> {
                    BigDecimal inc = incomeMap.getOrDefault(ym,BigDecimal.ZERO);
                    BigDecimal exp = expenseMap.getOrDefault(ym,BigDecimal.ZERO);
                    BigDecimal net = inc.subtract(exp);

                    String label = ym.getMonth().name().substring(0,3)+" "+ym.getYear();

                    return MonthlyCashFlowResponse.builder()
                            .monthLabel(label)
                            .income(inc)
                            .expense(exp)
                            .netBalance(net)
                            .year(ym.getYear())
                            .month(ym.getMonthValue())
                            .build();
                })
                .toList();

        return cashFlowResponseList;

    }





    private BigDecimal[] getMoMTotalSpentStats(Long userId,int month,int year){
        BigDecimal percentage;
        YearMonth ymC = YearMonth.of(year,month);
        LocalDate endDateC = ymC.atEndOfMonth();
        LocalDate startDateC = ymC.atDay(1);

        ExpenseStatsResponse currentMon = expenseRepository.getStats(userId,startDateC,endDateC,null);

        YearMonth ymP = ymC.minusMonths(1);
        LocalDate endDateP = ymP.atEndOfMonth();
        LocalDate startDateP = ymP.atDay(1);

        ExpenseStatsResponse previousMon = expenseRepository.getStats(userId,startDateP,endDateP,null);

        if(previousMon.getTotalAmount().equals(BigDecimal.ZERO)) {
             percentage = BigDecimal.valueOf(0);
        }else{
            percentage = (currentMon.getTotalAmount().subtract(previousMon.getTotalAmount())).divide(previousMon.getTotalAmount(),2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        }

        return new BigDecimal[]{previousMon.getTotalAmount(),currentMon.getTotalAmount(),percentage};
    }

    private SpikeData getMoMCategorySpike(Long userId, int month, int year){
        BigDecimal percentage;

        Map<String,BigDecimal> currentMon = this.budgetService.getCategoryAmtMap(userId,monthString(month),year);

        YearMonth ymC = YearMonth.of(year,month);
        YearMonth ymP = ymC.minusMonths(1);

        Map<String,BigDecimal> previousMon = this.budgetService.getCategoryAmtMap(userId,monthString(ymP.getMonthValue()),ymP.getYear());

        BigDecimal spike = BigDecimal.ZERO;
        String category = "";

        for(String key:currentMon.keySet()){
            if(currentMon.get(key).subtract(previousMon.getOrDefault(key, BigDecimal.ZERO)).compareTo(spike) > 0) {
                spike = currentMon.get(key).subtract(previousMon.getOrDefault(key, BigDecimal.ZERO));
                category= key;
            }
        }

        LocalDate startDateC = ymC.atDay(1);
        LocalDate endDateC = ymC.atEndOfMonth();
        LocalDate startDateP= ymP.atDay(1);
        LocalDate endDateP = ymP.atEndOfMonth();

        BigDecimal currentMonTotal = this.expenseService.getStats(userId,startDateC,endDateC,null).getTotalAmount();
        BigDecimal previousMonTotal = this.expenseService.getStats(userId,startDateP,endDateP,null).getTotalAmount();
        BigDecimal spikeTotal = currentMonTotal.subtract(previousMonTotal);

        if(spikeTotal.compareTo(BigDecimal.ZERO)>0){
            percentage = spike.divide(spikeTotal,2,RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        }else{
            percentage = BigDecimal.ZERO;
        }


        return new SpikeData(spike,percentage,category);
    }

    private ProjectedMonTotal getProjected(Long userId, int month, int year) {
        LocalDate today = LocalDate.now();

        // 1. Get Actual Spent (Reuse your existing method or variable)
        // Ideally, pass this IN as a parameter to avoid re-querying DB
        BigDecimal totalSpent = this.expenseRepository.calculateTotalSpent(userId, month, year, null);
        if (totalSpent == null) totalSpent = BigDecimal.ZERO;

        // 2. Get Total Budget (Handle Null)
        BigDecimal totalBudget = this.budgetRepository.getTotalBudget(userId, monthString(month), (long)year);
        if (totalBudget == null) totalBudget = BigDecimal.ZERO;

        BigDecimal predictedTotal;

        // 3. Logic Fork: Is this the Current Month?
        boolean isCurrentMonth = (today.getMonthValue() == month && today.getYear() == year);

        if (isCurrentMonth) {
            int daysPassed = today.getDayOfMonth();

            // Edge case: Very start of month or no spending
            if (daysPassed <= 1 || totalSpent.compareTo(BigDecimal.ZERO) == 0) {
                predictedTotal = totalSpent;
            } else {
                // Calculate Velocity
                BigDecimal dailyVelocity = totalSpent.divide(BigDecimal.valueOf(daysPassed), 2, RoundingMode.HALF_UP);

                // Calculate Remaining Days
                YearMonth ym = YearMonth.of(year, month);
                int totalDaysInMonth = ym.lengthOfMonth();
                int daysRemaining = totalDaysInMonth - daysPassed;

                // Prediction = Spent + (Velocity * Remaining)
                predictedTotal = totalSpent.add(dailyVelocity.multiply(BigDecimal.valueOf(daysRemaining)));
            }
        } else {
            // For Past/Future months, Prediction IS the Actual
            predictedTotal = totalSpent;
        }
        YearMonth ym= YearMonth.of(year,month);


        BigDecimal totalIncome = incomeRepository.calculateTotalIncome(userId,ym.atDay(1),ym.atEndOfMonth());

        // 4. Calculate Difference
        BigDecimal difference = predictedTotal.subtract(totalBudget);
        BigDecimal netBalance = totalIncome.subtract(predictedTotal);

        return new ProjectedMonTotal(predictedTotal, totalBudget, difference,netBalance);
    }

    private BigDecimal getDailySafeLimit(Long userId, int month , int year){
        YearMonth ym = YearMonth.of(year,month);
        BigDecimal totalIncome = incomeRepository.calculateTotalIncome(userId,ym.atDay(1),ym.atEndOfMonth());
        BigDecimal totalExpense = expenseRepository.calculateTotalSpent(userId,month,year,null);

        if(totalIncome == null) totalIncome = BigDecimal.ZERO;
        if(totalExpense == null) totalExpense =BigDecimal.ZERO;

        BigDecimal totalBudget = budgetRepository.getTotalBudget(userId,monthString(month),(long)year);
        if(totalBudget == null ||totalBudget.compareTo(BigDecimal.ZERO) == 0){
            totalBudget = totalIncome;
        }

        BigDecimal baselineAmount = totalBudget.min(totalIncome);

        BigDecimal remainingMoney = baselineAmount.subtract(totalExpense);

        if(remainingMoney.compareTo(BigDecimal.ZERO) <= 0){
            return BigDecimal.ZERO;
        }

        int remainingDays;
        YearMonth currentMonth = YearMonth.now();

        if(ym.equals(currentMonth)){
            remainingDays = ym.lengthOfMonth()-LocalDate.now().getDayOfMonth()+1;
        } else if(ym.isBefore(currentMonth)) {
            return BigDecimal.ZERO;
        }else {
            remainingDays = ym.lengthOfMonth();
        }

        return remainingMoney.divide(BigDecimal.valueOf(remainingDays),2,RoundingMode.HALF_UP);
    }



    private String monthString(int month){
        ArrayList<String> months = new ArrayList<>(java.util.Arrays.asList(
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
        ));
        return months.get(month-1);
    }
}
