package com.project.MoneyT.controller;

import com.project.MoneyT.dto.budgetDTO.BudgetRequest;
import com.project.MoneyT.dto.budgetDTO.BudgetResponse;
import com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse;
import com.project.MoneyT.security.SecurityUtils;
import com.project.MoneyT.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(@RequestParam String month,
                                                     @RequestParam Integer year){
        Long userId = securityUtils.getCurrentUserId();
        List<BudgetResponse> budgetResponse = budgetService.getBudget(userId,month,year);

        return ResponseEntity.ok(budgetResponse);
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@RequestBody BudgetRequest request){
        Long userId = securityUtils.getCurrentUserId();
        BudgetResponse  response = budgetService.createBudget(userId,request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> updateBudget(
            @PathVariable("id") Long budgetId,
            @RequestBody BudgetRequest request)
    {
        Long userId = securityUtils.getCurrentUserId();
        BudgetResponse response = budgetService.updateBudget(userId,budgetId,request);

        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable("id") Long budgetId
    ){
        Long userId = securityUtils.getCurrentUserId();
        budgetService.deleteBudget(userId,budgetId);
        return ResponseEntity.noContent().build();

    }

    @GetMapping("/unbudgeted")
    public ResponseEntity<List<CategoryBreakdownResponse>> getUnBudgetedSpending(@RequestParam String month,

                                                                                 @RequestParam Integer year){
        Long userId = securityUtils.getCurrentUserId();
        List<CategoryBreakdownResponse> unBudgetedSpending =  budgetService.getUnBudgetedSpending(userId,month,year);

        return ResponseEntity.ok(unBudgetedSpending);
    }




}
