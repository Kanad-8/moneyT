package com.project.MoneyT.service;

import com.project.MoneyT.dto.budgetDTO.*;
import com.project.MoneyT.exception.ResourceNotFoundException;
import com.project.MoneyT.model.Budget;
import com.project.MoneyT.model.User;
import com.project.MoneyT.repository.BudgetRepository;
import com.project.MoneyT.repository.ExpenseRepository;
import com.project.MoneyT.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class BudgetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    private final Logger logger = Logger.getLogger("log");

    public List<BudgetResponse> getBudget(Long userId, String month , Integer year){
        List<Budget> budgets = budgetRepository.findByUserUserIdAndMonthAndYear(userId,month,year);
        Map<String ,BigDecimal> spentMap = getCategoryAmtMap(userId,month,year);
        return budgets.stream().map(budget ->
            mapToBudgetResponse(budget,spentMap.getOrDefault(budget.getCategory(),BigDecimal.ZERO))).toList();

    }

    public Map<String,BigDecimal> getCategoryAmtMap(Long userId, String month, Integer year){

        List<CategoryBreakdownResponse> budgetList = expenseRepository.getTotalExpenseByCategory(userId,monthInt(month),year);

        return budgetList.stream().collect(Collectors.toMap(
                CategoryBreakdownResponse::getCategoryName,
                CategoryBreakdownResponse::getPercentage
        ));
    }

    //Create Budget
    public BudgetResponse createBudget(Long userId, BudgetRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not Found"));

        if(budgetRepository.findByUserAndCategoryAndMonthAndYear(user,request.getCategory(),request.getMonth(),request.getYear()).isPresent()){
            throw new RuntimeException("Budget Already exists for this category/month/year");
        }

        Budget budget = new Budget();
        budget.setUser(user);
        budget.setCategory(request.getCategory());
        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());

        Budget saved = budgetRepository.save(budget);
        return mapToBudgetResponse(saved,BigDecimal.ZERO);
    }

    //Update Budget
    public BudgetResponse updateBudget(Long userId, Long budgetId, BudgetRequest request){
        Budget budget = budgetRepository.findById(budgetId).orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if(!budget.getUser().getUserId().equals(userId)){
            throw new RuntimeException("Unauthorized");
        }

        budget.setLimitAmount(request.getLimitAmount());

        Budget updated = budgetRepository.save(budget);

        //Recalculate spent
        int monthInt = monthInt(updated.getMonth());
        BigDecimal spent = expenseRepository.calculateTotalSpent(userId,monthInt,updated.getYear(),updated.getCategory());

        return mapToBudgetResponse(updated,spent == null ? BigDecimal.ZERO :spent);

    }

    public void deleteBudget(Long userId,Long budgetId){
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if(!budget.getUser().getUserId().equals(userId)){
            throw new RuntimeException("Unauthorized");
        }
        budgetRepository.delete(budget);
    }

    public List<RiskyBudgetResponse> getRiskyBudgets(Long userId, String month, Integer year){

        List<BudgetResponse> allBudget = getBudget(userId,month,year);

        return allBudget.stream()
                .filter(b ->b.getPercentageUsed() > 80.0)
                .map(b -> new RiskyBudgetResponse(b.getCategory(),b.getPercentageUsed()))
                .collect(toList());
    }

    public BudgetSummaryResponse getBudgetSummary(Long userId, String month, Integer year){
        logger.log(Level.SEVERE, this.getBudget(userId,month,year).toString());
        List<BudgetResponse> allBudgets = this.getBudget(userId, month, year);
        logger.log(Level.SEVERE,"All bugets"+allBudgets);

        BigDecimal totalBudgeted = BigDecimal.ZERO;
        BigDecimal totalSpent = BigDecimal.ZERO;

        for(BudgetResponse b:allBudgets){
            logger.log(Level.SEVERE,"ADD"+b.getLimitAmount());
            totalBudgeted = totalBudgeted.add(b.getLimitAmount());
            totalSpent = totalSpent.add(b.getSpentAmount());
        }
        logger.log(Level.SEVERE,"Dashboard Stats"+totalBudgeted+"#"+totalSpent);


        return new BudgetSummaryResponse(totalBudgeted,totalSpent,totalBudgeted.subtract(totalSpent));
    }

    public List<CategoryBreakdownResponse> getUnBudgetedSpending(Long userId,String month,Integer year){
        List<Budget> budgets = budgetRepository.findByUserUserIdAndMonthAndYear(userId,month,year);
        List<String> budgetedCategories = budgets.stream().map(Budget::getCategory).toList();

        int monthInt = monthInt(month);
        return expenseRepository.findUnBudgetedSpending(userId,monthInt,year,budgetedCategories);
    }




    private int monthInt(String month){
        ArrayList<String> months = new ArrayList<>(java.util.Arrays.asList(
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
        ));
        return months.indexOf(month)+1;
    }

    private BudgetResponse mapToBudgetResponse(Budget budget, BigDecimal spent){
        BudgetResponse response = new BudgetResponse();
        response.setId(budget.getBudgetId());
        response.setCategory(budget.getCategory());
        response.setSpentAmount(spent);
        response.setLimitAmount(budget.getLimitAmount());
        response.setRemainingAmount(budget.getLimitAmount().subtract(spent));

        if(budget.getLimitAmount().compareTo(BigDecimal.ZERO) > 0){
            double pct = spent.doubleValue()/budget.getLimitAmount().doubleValue() * 100;
            response.setPercentageUsed(pct);
            response.setOverBudget(pct >100);
        }else{
            response.setPercentageUsed(0.0);
            response.setOverBudget(false);
        }
        return response;
    }






}
