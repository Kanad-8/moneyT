package com.project.MoneyT.controller;


import com.project.MoneyT.dto.expenseDTO.ExpenseDashboardResponse;
import com.project.MoneyT.dto.expenseDTO.ExpenseRequest;
import com.project.MoneyT.dto.expenseDTO.ExpenseResponse;
import com.project.MoneyT.security.SecurityUtils;
import com.project.MoneyT.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<Map<String,Object>> getAllExpenses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ){
        int springPage = page - 1;
        Long userId = securityUtils.getCurrentUserId();
        Page<ExpenseResponse> expensePage = expenseService.loadExpenses(
                userId,springPage,limit,category,startDate,endDate
        );

        Map<String , Object> response = new HashMap<>();
        response.put("data" , expensePage.getContent());
        response.put("total", expensePage.getTotalElements());

        return ResponseEntity.ok(response);

    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@RequestBody ExpenseRequest request){
        Long userId = securityUtils.getCurrentUserId();
        ExpenseResponse createdExpense = expenseService.createExpense(request,userId);
        return new ResponseEntity<>(createdExpense, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @RequestBody ExpenseRequest request
    ){
        Long userId = securityUtils.getCurrentUserId();
        ExpenseResponse updatedExpense = expenseService.updateExpense(userId,id,request);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id){
        Long userId = securityUtils.getCurrentUserId();
        expenseService.deleteExpense(userId,id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<ExpenseDashboardResponse> getStats(
            @RequestParam(required = false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category

    ){
        Long userId = securityUtils.getCurrentUserId();
        ExpenseDashboardResponse stats = expenseService.getStats(userId,startDate,endDate,category);
        return ResponseEntity.ok(stats);

    }
}
