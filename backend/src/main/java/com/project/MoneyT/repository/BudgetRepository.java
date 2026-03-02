package com.project.MoneyT.repository;

import com.project.MoneyT.model.Budget;
import com.project.MoneyT.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface BudgetRepository extends JpaRepository<Budget,Long> {

    List<Budget> findByUser(User user);
    List<Budget> findByUserAndCategory(User user,String category);
    List<Budget> findByUserAndMonthAndYear(User user,String month,Integer year);
    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user,String category,String month,Integer year);
    List<Budget> findByUserUserIdAndMonthAndYear(Long userId,String month,Integer year);

    @Query("SELECT SUM(b.limitAmount) FROM Budget b " +
            "WHERE b.user.userId = :user_id " +
            "AND b.month = :month " +
            "AND b.year = :year")
    BigDecimal getTotalBudget(
            @Param("user_id") Long userId,
            @Param("month") String month,
            @Param("year") Long year
    );

}
