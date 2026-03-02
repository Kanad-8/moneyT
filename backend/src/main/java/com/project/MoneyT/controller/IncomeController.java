package com.project.MoneyT.controller;

import com.project.MoneyT.dto.expenseDTO.ExpenseDashboardResponse;
import com.project.MoneyT.dto.expenseDTO.ExpenseRequest;
import com.project.MoneyT.dto.expenseDTO.ExpenseResponse;
import com.project.MoneyT.dto.incomeDTO.IncomeRequest;
import com.project.MoneyT.dto.incomeDTO.IncomeResponse;
import com.project.MoneyT.security.SecurityUtils;
import com.project.MoneyT.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/income")
public class IncomeController {

    private final IncomeService incomeService;
    private final SecurityUtils securityUtils;

    // 1. Get All Incomes (with Pagination & Filtering)
    @GetMapping
    public ResponseEntity<Map<String,Object>> getAllIncomes(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String source, // Changed from category to source
            @RequestParam(required = false) String search, // Keep if you plan to implement description search
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ){
        int springPage = page - 1;
        Long userId = securityUtils.getCurrentUserId();

        // Note: Make sure you have this 'getFilteredIncomes' method created in your IncomeService!
        Page<IncomeResponse> incomePage = incomeService.loadIncome(
                userId, springPage, limit, source, startDate, endDate
        );

        Map<String , Object> response = new HashMap<>();
        response.put("data" , incomePage.getContent());
        response.put("total", incomePage.getTotalElements());

        return ResponseEntity.ok(response);
    }

    // 2. Create Income
    @PostMapping
    public ResponseEntity<IncomeResponse> createIncome(@RequestBody IncomeRequest request){
        Long userId = securityUtils.getCurrentUserId();
        IncomeResponse createdIncome = incomeService.createIncome(request, userId);
        return new ResponseEntity<>(createdIncome, HttpStatus.CREATED);
    }

    // 3. Update Income
    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponse> updateIncome(
            @PathVariable Long id,
            @RequestBody IncomeRequest request
    ){
        Long userId = securityUtils.getCurrentUserId();
        IncomeResponse updatedIncome = incomeService.updateIncome(userId, id, request);
        return ResponseEntity.ok(updatedIncome);
    }

    // 4. Delete Income
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id){
        Long userId = securityUtils.getCurrentUserId();
        incomeService.deleteIncome(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/totalIncome")
    public ResponseEntity<BigDecimal> getTotalIncome(
    ){
        Long userId = securityUtils.getCurrentUserId();
        YearMonth ym = YearMonth.now();
        BigDecimal totalIncome = incomeService.getTotalIncome(userId,ym);
        System.out.print(totalIncome);
        return ResponseEntity.ok(totalIncome);
    }




}
