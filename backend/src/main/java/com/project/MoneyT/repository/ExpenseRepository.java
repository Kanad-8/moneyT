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

  // 1a. Find Filtered Expense - All Categories
  @Query("SELECT e FROM Expense e WHERE e.user.userId = :userId " +
    "AND e.expenseDate BETWEEN :startDate AND :endDate")
  Page<Expense> findFilteredExpenseAllCategories(
    @Param("userId") Long userId,
    @Param("startDate") LocalDate startDate,
    @Param("endDate") LocalDate endDate,
    Pageable pageable
  );

  // 1b. Find Filtered Expense - Specific Category
  @Query("SELECT e FROM Expense e WHERE e.user.userId = :userId " +
    "AND e.category = :category " +
    "AND e.expenseDate BETWEEN :startDate AND :endDate")
  Page<Expense> findFilteredExpenseByCategory(
    @Param("userId") Long userId,
    @Param("category") String category,
    @Param("startDate") LocalDate startDate,
    @Param("endDate") LocalDate endDate,
    Pageable pageable
  );

  // 2a. Get Stats - All Categories
  @Query("SELECT new com.project.MoneyT.dto.expenseDTO.ExpenseStatsResponse(" +
    "SUM(e.amount), AVG(e.amount), COUNT(e)) " +
    "FROM Expense e WHERE e.user.userId = :userId " +
    "AND e.expenseDate BETWEEN :startDate AND :endDate")
  ExpenseStatsResponse getStatsAllCategories(
    @Param("userId") Long userId,
    @Param("startDate") LocalDate startDate,
    @Param("endDate") LocalDate endDate
  );

  // 2b. Get Stats - Specific Category
  @Query("SELECT new com.project.MoneyT.dto.expenseDTO.ExpenseStatsResponse(" +
    "SUM(e.amount), AVG(e.amount), COUNT(e)) " +
    "FROM Expense e WHERE e.user.userId = :userId " +
    "AND e.expenseDate BETWEEN :startDate AND :endDate " +
    "AND e.category = :category")
  ExpenseStatsResponse getStatsByCategory(
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
  @Query("SELECT new com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse(" +
    "e.category, SUM(e.amount)) " +
    "FROM Expense e " +
    "WHERE e.user.userId = :userId " +
    "AND EXTRACT(MONTH FROM e.expenseDate) = :month " +
    "AND EXTRACT(YEAR FROM e.expenseDate) = :year " +
    "AND e.category NOT IN :budgetedCategories " +
    "GROUP BY e.category")
  List<CategoryBreakdownResponse> findUnBudgetedSpending(
    @Param("userId") Long userId,
    @Param("month") int month,
    @Param("year") int year,
    @Param("budgetedCategories") List<String> budgetedCategories
  );

  // 5. Total Expense By Category
  @Query("SELECT new com.project.MoneyT.dto.budgetDTO.CategoryBreakdownResponse(" +
    "e.category, COALESCE(SUM(e.amount),0)) " +
    "FROM Expense e " +
    "WHERE e.user.userId = :userId " +
    "AND EXTRACT(MONTH FROM e.expenseDate) = :month " +
    "AND EXTRACT(YEAR FROM e.expenseDate) = :year " +
    "GROUP BY e.category")
  List<CategoryBreakdownResponse> getTotalExpenseByCategory(
    @Param("userId") Long userId,
    @Param("month") int month,
    @Param("year") int year
  );

  // 6a. Calculate Total Spent - All Categories
  @Query("SELECT COALESCE(SUM(e.amount),0) FROM Expense e " +
    "WHERE e.user.userId = :userId " +
    "AND EXTRACT(MONTH FROM e.expenseDate) = :month " +
    "AND EXTRACT(YEAR FROM e.expenseDate) = :year")
  BigDecimal calculateTotalSpentAllCategories(
    @Param("userId") Long userId,
    @Param("month") int month,
    @Param("year") int year
  );

  // 6b. Calculate Total Spent - Specific Category
  @Query("SELECT COALESCE(SUM(e.amount),0) FROM Expense e " +
    "WHERE e.user.userId = :userId " +
    "AND EXTRACT(MONTH FROM e.expenseDate) = :month " +
    "AND EXTRACT(YEAR FROM e.expenseDate) = :year " +
    "AND e.category = :category")
  BigDecimal calculateTotalSpentByCategory(
    @Param("userId") Long userId,
    @Param("month") int month,
    @Param("year") int year,
    @Param("category") String category
  );

  // 7. Monthly Expense Trend
  @Query("SELECT new com.project.MoneyT.dto.incomeDTO.MonthlyTrendResponse(" +
    "EXTRACT(YEAR FROM e.expenseDate), EXTRACT(MONTH FROM e.expenseDate), SUM(e.amount)) " +
    "FROM Expense e " +
    "WHERE e.user.userId = :userId " +
    "AND e.expenseDate >= :startDate " +
    "GROUP BY EXTRACT(YEAR FROM e.expenseDate), EXTRACT(MONTH FROM e.expenseDate) " +
    "ORDER BY EXTRACT(YEAR FROM e.expenseDate) ASC, EXTRACT(MONTH FROM e.expenseDate) ASC")
  List<MonthlyTrendResponse> getMonthlyExpenseTrend(
    @Param("userId") Long userId,
    @Param("startDate") LocalDate startDate
  );

}
