package com.project.MoneyT.service;


import com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse;
import com.project.MoneyT.dto.expenseDTO.ExpenseDashboardResponse;
import com.project.MoneyT.dto.expenseDTO.ExpenseRequest;
import com.project.MoneyT.dto.expenseDTO.ExpenseResponse;
import com.project.MoneyT.dto.expenseDTO.ExpenseStatsResponse;
import com.project.MoneyT.exception.ResourceNotFoundException;
import com.project.MoneyT.model.Expense;
import com.project.MoneyT.model.User;
import com.project.MoneyT.repository.ExpenseRepository;
import com.project.MoneyT.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static java.util.logging.Level.SEVERE;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = Logger.getLogger("Log");

    public Page<ExpenseResponse> loadExpenses(Long userId , int page , int limit, String category , LocalDate startDate, LocalDate endDate){
        Pageable pageable = PageRequest.of(page,limit, Sort.by("expenseDate").descending());

        if(startDate == null) startDate = LocalDate.of(2000,1,1);
        if(endDate == null) endDate = LocalDate.now();
        Page<Expense> expensePage;
        if(category == null ) expensePage =expenseRepository.findFilteredExpenseAllCategories(userId,startDate,endDate,pageable);
        else   expensePage =expenseRepository.findFilteredExpenseByCategory(userId,category,startDate,endDate,pageable);



        return expensePage.map(this::mapToResponse);
    }

    //Create
    public ExpenseResponse createExpense(ExpenseRequest request, Long userId)  {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if(request.getAmount().compareTo(BigDecimal.ZERO) <= 0){
            throw new IllegalArgumentException("Amount must be positive");
        }

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getDate());

        Expense savedExpense = expenseRepository.save(expense);

        return mapToResponse(savedExpense);

    }


    //Update
    public ExpenseResponse updateExpense(Long userId,Long expenseId,ExpenseRequest expenseRequest){
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense Not Found"));

        if(!expense.getUser().getUserId().equals(userId)){
            throw new RuntimeException("Unauthorized access to expense");
        }

        expense.setAmount(expenseRequest.getAmount());
        expense.setDescription(expenseRequest.getDescription());
        expense.setCategory(expenseRequest.getCategory());
        expense.setExpenseDate(expenseRequest.getDate());

        Expense updated = expenseRepository.save(expense);
        return mapToResponse(updated);
    }

    //Delete
    public void deleteExpense(Long userId, Long expenseId){
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not Found"));

        if(!expense.getUser().getUserId().equals(userId)){
            throw new RuntimeException("Unauthorized access to expense");
        }

        expenseRepository.delete(expense);
    }

    //Get Recent Transaction
    public List<ExpenseResponse> getRecentTransactions(Long userId, int limit){

        Pageable pageable = PageRequest.of(0,limit,Sort.by("expenseDate").descending());

        Page<Expense> page = expenseRepository.findFilteredExpenseAllCategories(userId,LocalDate.of(2000,1,1),LocalDate.now(),pageable);

        return page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    //Get Stats
    public ExpenseDashboardResponse getStats(Long userId, LocalDate startDate, LocalDate endDate,String category){
      ExpenseStatsResponse stats;
      ExpenseDashboardResponse response = new ExpenseDashboardResponse();
      if(category == null ) stats =  expenseRepository.getStatsAllCategories(userId,startDate,endDate);
      else  stats =  expenseRepository.getStatsByCategory(userId,startDate,endDate,category);
      BeanUtils.copyProperties(stats,response);
      response.setCategoryBreakdown(this.getCategoryBreakdownExpense(userId,startDate,endDate));

      return response;
    }

    //Get Category Breakdown
    public List<CategoryBreakdownResponse> getCategoryBreakdown(Long userId,LocalDate startDate,LocalDate endDate){
        if(startDate == null) {
           startDate = LocalDate.of(2000, 1, 1);
            logger.log(SEVERE,"StartDate is null");

        }
        if(endDate == null) endDate = LocalDate.now();

        List<CategoryBreakdownResponse> list = expenseRepository.getCategoryBreakdown(userId,startDate,endDate);
        BigDecimal totalSpent = expenseRepository.calculateTotalSpentAllCategories(userId, startDate.getMonth().getValue(),startDate.getYear());

        for( CategoryBreakdownResponse c :list){
            c.setPercentage(c.getPercentage().divide(totalSpent,2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));
        }

        return list;
    }

    public List<CategoryBreakdownResponse> getCategoryBreakdownExpense(Long userId,LocalDate startDate,LocalDate endDate){
        if(startDate == null) {
           startDate = LocalDate.of(2000, 1, 1);
            logger.log(SEVERE,"StartDate is null");

        }
        if(endDate == null) endDate = LocalDate.now();

        return expenseRepository.getCategoryBreakdown(userId,startDate,endDate);
    }



    private ExpenseResponse mapToResponse(Expense entity){
        ExpenseResponse dto = new ExpenseResponse();
        dto.setId(entity.getExpenseId());
        dto.setAmount(entity.getAmount());
        dto.setCategory(entity.getCategory());
        dto.setDescription(entity.getDescription());
        dto.setDate(entity.getExpenseDate());
        dto.setCreatedAt(entity.getCreatedAt().toString());
        return dto;
    }

    private Expense mapToEntity(ExpenseRequest request,Long userId) throws Exception {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getDate());

        return expense;

    }







}
