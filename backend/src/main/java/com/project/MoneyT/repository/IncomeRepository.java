package com.project.MoneyT.repository;

import com.project.MoneyT.dto.incomeDTO.IncomeSourceBreakdownResponse;
import com.project.MoneyT.dto.incomeDTO.MonthlyTrendResponse;
import com.project.MoneyT.model.Expense;
import com.project.MoneyT.model.Income;
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
public interface IncomeRepository extends JpaRepository<Income,Long> {

    List<Expense> findByUser(User user);
    List<Expense> findByUserUserId(Long userId);
    List<Expense> findBySourceAndUser(User user, String source);
    List<Expense> findByUserAndIncomeDateBetween(User user,LocalDateTime start,LocalDateTime end);
    List<Expense> findByUserAndSourceAndIncomeDateBetween(User user, String source,LocalDateTime start,LocalDateTime end);

    //Filtered Income (Pagination & Search)
    @Query("SELECT i FROM Income i WHERE i.user.userId = :userId " +
            "AND (:source IS NULL OR i.source = :source) " +
            "AND i.incomeDate BETWEEN :startDate AND :endDate")
    Page<Income> findFilteredIncome(
            @Param("userId") Long userId,
            @Param("source") String source,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );

    // Get total income monthly
    @Query("SELECT COALESCE(SUM(i.amount),0) FROM Income i " +
            "WHERE i.user.id = :userId " +
            "AND i.incomeDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalIncome(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Income Source Breakdown (For Pie Charts)
    @Query("SELECT new com.project.MoneyT.dto.incomeDTO.IncomeSourceBreakdownResponse(" +
            "i.source, SUM(i.amount)) " +
            "FROM Income i WHERE i.user.userId = :userId " +
            "AND i.incomeDate BETWEEN :startDate AND :endDate " +
            "GROUP BY i.source")
    List<IncomeSourceBreakdownResponse> getIncomeSourceBreakdown(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    //Get month over month income trend
    @Query("SELECT new com.project.MoneyT.dto.incomeDTO.MonthlyTrendResponse(" +
            "YEAR(i.incomeDate), MONTH(i.incomeDate), SUM(i.amount)) " +
            "FROM Income i " +
            "WHERE i.user.userId = :userId " +
            "AND i.incomeDate >= :startDate " +
            "GROUP BY YEAR(i.incomeDate), MONTH(i.incomeDate) " +
            "ORDER BY YEAR(i.incomeDate) ASC, MONTH(i.incomeDate) ASC")
    List<MonthlyTrendResponse> getMonthlyIncomeTrend(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate
    );
}
