package com.project.MoneyT.controller;


import com.project.MoneyT.dto.budgetDTO.BudgetResponse;
import com.project.MoneyT.dto.dashboardDTO.DashboardOverview;
import com.project.MoneyT.repository.UserRepository;
import com.project.MoneyT.security.SecurityUtils;
import com.project.MoneyT.service.BudgetService;
import com.project.MoneyT.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/dashboard-overview")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private SecurityUtils securityUtils;

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<DashboardOverview> getDashboard(
            @RequestParam @DateTimeFormat(iso= DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso= DateTimeFormat.ISO.DATE) LocalDate endDate
    ){
        Long userId = securityUtils.getCurrentUserId();
        DashboardOverview overview = dashboardService.getDashboardOverview(userId,startDate,endDate);
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/bb")
    public ResponseEntity<List<BudgetResponse>> getBudgetList(
            @RequestParam String month,
            @RequestParam Integer year
    ){
        Long userId = securityUtils.getCurrentUserId();
        List<BudgetResponse> list = budgetService.getBudget(userId,month,year);
        return ResponseEntity.ok(list);
    }

}
