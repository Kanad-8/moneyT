package com.project.MoneyT.repository;

import com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse;
import com.project.MoneyT.dto.expenseDTO.ExpenseStatsResponse;
import com.project.MoneyT.dto.incomeDTO.MonthlyTrendResponse;
import com.project.MoneyT.model.Expense;
import com.project.MoneyT.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense,Long> {

    List<Expense> findByUser(User user);
    List<Expense> findByUserUserId(Long userId);
    List<Expense> findByCategoryAndUser(User user, String category);
    List<Expense> findByUserAndExpenseDateBetween(User user,LocalDateTime start,LocalDateTime end);
    List<Expense> findByUserAndCategoryAndExpenseDateBetween(User user, String category,LocalDateTime start,LocalDateTime end);

    @Query("SELECT e FROM Expense e WHERE e.user.userId = :userId " +
            "AND (:category IS NULL OR e.category = :category) " +
            "AND e.expenseDate BETWEEN :startDate AND :endDate")
    Page<Expense> findFilteredExpense(
            @Param("userId") Long userId,
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );

    // 2. Get Stats
    // Refactored: Uses 'e.user.userId', Fixed missing ')' after COUNT(e)
    @Query("SELECT new com.project.MoneyT.dto.expenseDTO.ExpenseStatsResponse(" +
            "SUM(e.amount), AVG(e.amount), COUNT(e)) " +
            "FROM Expense e WHERE e.user.userId = :userId " +
            "AND (:startDate IS NULL OR :endDate IS NULL OR  e.expenseDate BETWEEN :startDate AND :endDate) "+
            "AND (:category IS NULL OR e.category = :category) ")
    ExpenseStatsResponse getStats(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("category") String category
    );

    // 3. Category Breakdown
    // Refactored: Uses 'e.user.userId', Fixed constructor syntax
    @Query("SELECT new com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse(" +
            "e.category, SUM(e.amount)) " +
            "FROM Expense e WHERE e.user.userId = :userId " +
            "AND e.expenseDate BETWEEN :startDate AND :endDate " +
            "GROUP BY e.category")
    List<CategoryBreakdownResponse> getCategoryBreakdown(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // 4. Unbudgeted Spending
    // Refactored: Uses 'e.user.userId', Fixed missing ')' after SUM(e.amount)
    @Query("SELECT new com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse(" +
            "e.category, SUM(e.amount)) " +
            "FROM Expense e " +
            "WHERE e.user.userId = :userId " +
            "AND FUNCTION('MONTH', e.expenseDate) = :month " +
            "AND FUNCTION('YEAR', e.expenseDate) = :year " +
            "AND e.category NOT IN :budgetedCategories " +
            "GROUP BY e.category")
    List<CategoryBreakdownResponse> findUnBudgetedSpending(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year,
            @Param("budgetedCategories") List<String> budgetedCategories
    );

    // 5. Total Expense By Category
    // Refactored: Uses 'e.user.userId', Fixed missing ')' after SUM(e.amount)
    @Query("SELECT new com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse(" +
            "e.category, COALESCE(SUM(e.amount),0)) " +
            "FROM Expense e " +
            "WHERE e.user.userId = :userId " +
            "AND FUNCTION('MONTH', e.expenseDate) = :month " +
            "AND FUNCTION('YEAR', e.expenseDate) = :year " +
            "GROUP BY e.category")
    List<CategoryBreakdownResponse> getTotalExpenseByCategory(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year
    );

    // 6. Calculate Total Spent (Single Category)
    // Refactored: Uses 'e.user.userId', Fixed spacing in query
    @Query("SELECT COALESCE(SUM(e.amount),0) FROM Expense e " +
            "WHERE e.user.userId = :userId " +
            "AND FUNCTION('MONTH', e.expenseDate) = :month " +
            "AND FUNCTION('YEAR', e.expenseDate) = :year " +
            "AND (:category IS NULL OR  e.category = :category) ")
    BigDecimal calculateTotalSpent(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year,
            @Param("category") String category
    );

    @Query("SELECT new com.project.MoneyT.dto.incomeDTO.MonthlyTrendResponse(" +
            "YEAR(e.expenseDate), MONTH(e.expenseDate), SUM(e.amount)) " +
            "FROM Expense e " +
            "WHERE e.user.userId = :userId " +
            "AND e.expenseDate >= :startDate " +
            "GROUP BY YEAR(e.expenseDate), MONTH(e.expenseDate) " +
            "ORDER BY YEAR(e.expenseDate) ASC, MONTH(e.expenseDate) ASC")
    List<MonthlyTrendResponse> getMonthlyExpenseTrend(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate
    );


}
