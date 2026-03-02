package com.project.MoneyT.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expense_id")
    private Long expenseId;

    @ManyToOne(fetch = FetchType.LAZY , optional = false)
    @JoinColumn(name="user_id",nullable = false, referencedColumnName = "user_id")
    private User user;

    @Column(name="category" , nullable = false,length = 50)
    private String category;

    @Column(name="description",nullable = true,length = 255)
    private String description;

    @Column(name="amount",nullable = false,precision = 10,scale = 2)
    private BigDecimal amount;

    @Column(name="expense_date",nullable = false)
    private LocalDate expenseDate;

    @CreationTimestamp
    @Column(name="created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Expense(){}

    public Expense(
            User user,
            String category,
            String description,
            BigDecimal amount,
            LocalDate expenseDate
    ){
        this.user=user;
        this.category=category;
        this.description=description;
        this.amount=amount;
        this.expenseDate = expenseDate;
    }

}
