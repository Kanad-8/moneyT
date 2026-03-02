package com.project.MoneyT.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="budgets",uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id","category","budget_month","budget_year"})
})
public class Budget {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="budget_id")
    private Long budgetId;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name="user_id",nullable = false,referencedColumnName = "user_id")
    private User user;

    @Column(name="category" , nullable = false,length = 50)
    private String category;

    @Column(name="limit_amount",nullable = false,precision = 10,scale = 2)
    private BigDecimal limitAmount;

    @Column(name = "budget_month",nullable = false,length = 20)
    private String month;

    @Column(name="budget_year",nullable = false)
    private Integer year;

    @CreationTimestamp
    @Column(name="created_at",nullable = false,updatable = false)
    private LocalDateTime createdAt;

}
