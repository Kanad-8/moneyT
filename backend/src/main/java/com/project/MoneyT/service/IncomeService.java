package com.project.MoneyT.service;

import com.project.MoneyT.dto.incomeDTO.IncomeRequest;
import com.project.MoneyT.dto.incomeDTO.IncomeResponse;
import com.project.MoneyT.dto.incomeDTO.IncomeSourceBreakdownResponse;
import com.project.MoneyT.exception.ResourceNotFoundException;
import com.project.MoneyT.model.Income;
import com.project.MoneyT.model.User;
import com.project.MoneyT.repository.ExpenseRepository;
import com.project.MoneyT.repository.IncomeRepository;
import com.project.MoneyT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public Page<IncomeResponse> loadIncome(Long userId , int page , int limit, String category , LocalDate startDate, LocalDate endDate){
        Pageable pageable = PageRequest.of(page,limit, Sort.by("incomeDate").descending());

        if(startDate == null) startDate = LocalDate.of(2000,1,1);
        if(endDate == null) endDate = LocalDate.now();

      Page<Income> incomePage;

        if(category == null){
          incomePage =incomeRepository.findFilteredIncomeAllSources(userId,startDate,endDate,pageable);
        }else   incomePage =incomeRepository.findFilteredIncomeBySource(userId,category,startDate,endDate,pageable);


        return incomePage.map(this::mapToResponse);
    }


    public IncomeResponse createIncome(IncomeRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if(request.getAmount().compareTo(BigDecimal.ZERO) <= 0){
            throw new IllegalArgumentException("Amount must be positive");
        }

        Income income = new Income();
        income.setUser(user);
        income.setSource(request.getSource());
        income.setDescription(request.getDescription());
        income.setAmount(request.getAmount());
        income.setIncomeDate(request.getDate());

        Income savedIncome = incomeRepository.save(income);

        return mapToResponse(savedIncome);
    }

    // Update
    public IncomeResponse updateIncome(Long userId, Long incomeId, IncomeRequest incomeRequest){
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Income Not Found"));

        // Verify ownership
        if(!income.getUser().getUserId().equals(userId)){
            throw new RuntimeException("Unauthorized access to income");
        }

        // Update fields
        income.setAmount(incomeRequest.getAmount());
        income.setDescription(incomeRequest.getDescription());
        income.setSource(incomeRequest.getSource());       // Changed from Category -> Source
        income.setIncomeDate(incomeRequest.getDate());     // Changed from ExpenseDate -> IncomeDate

        Income updated = incomeRepository.save(income);
        return mapToResponse(updated);
    }

    // Delete
    public void deleteIncome(Long userId, Long incomeId){
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Income not Found"));

        // Verify ownership
        if(!income.getUser().getUserId().equals(userId)){
            throw new RuntimeException("Unauthorized access to income");
        }

        incomeRepository.delete(income);
    }

    // Get Recent Income (Transactions)
    public List<IncomeResponse> getRecentIncome(Long userId, int limit){

        // Sort by incomeDate descending to get the newest first
        Pageable pageable = PageRequest.of(0, limit, Sort.by("incomeDate").descending());

        // Fetch using the repository method we created earlier
        Page<Income> page = incomeRepository.findFilteredIncomeAllSources(
                userId,
                LocalDate.of(2000, 1, 1),
                LocalDate.now(),
                pageable
        );

        return page.getContent().stream()
                .map(this::mapToResponse) // Make sure you have a mapToResponse(Income i) method in this service!
                .collect(Collectors.toList());
    }

    public BigDecimal getTotalIncome(Long userId,YearMonth ym){
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();
        return this.incomeRepository.calculateTotalIncome(userId,startDate,endDate);
    }

    public BigDecimal getNetSavings(Long userId,YearMonth ym){
        BigDecimal totalExpense = this.expenseRepository.calculateTotalSpentAllCategories(userId,ym.getMonthValue(),ym.getYear());
        BigDecimal totalIncome = this.incomeRepository.calculateTotalIncome(userId,ym.atDay(1),ym.atEndOfMonth());
        return totalIncome.subtract(totalExpense);
    }

    public Long getSavingsRate(Long userId,YearMonth ym){
        BigDecimal netSavings = getNetSavings(userId,ym);
        BigDecimal totalIncome = getTotalIncome(userId,ym);
        if(totalIncome.compareTo(BigDecimal.ZERO) == 0) return (long)0;
        return Math.round(netSavings.divide(totalIncome, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue());
    }

    public List<IncomeSourceBreakdownResponse> getIncomeSourceBreakdown(Long userId,YearMonth ym){
        return this.incomeRepository.getIncomeSourceBreakdown(userId,ym.atDay(1),ym.atEndOfMonth());

    }

    private IncomeResponse mapToResponse(Income entity){
        IncomeResponse dto = new IncomeResponse();
        dto.setId(entity.getIncomeId());
        dto.setAmount(entity.getAmount());
        dto.setSource(entity.getSource());
        dto.setDescription(entity.getDescription());
        dto.setDate(entity.getIncomeDate());
        dto.setCreatedAt(entity.getCreatedAt().toString());
        return dto;
    }


}
