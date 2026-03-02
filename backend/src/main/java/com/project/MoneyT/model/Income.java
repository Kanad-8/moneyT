package com.project.MoneyT.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="income")
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "income_id")
    private Long incomeId;

    @ManyToOne(fetch = FetchType.LAZY , optional = false)
    @JoinColumn(name="user_id",nullable = false, referencedColumnName = "user_id")
    private User user;

    @Column(name="source" , nullable = false,length = 50)
    private String source;

    @Column(name="description",nullable = true,length = 255)
    private String description;

    @Column(name="amount",nullable = false,precision = 10,scale = 2)
    private BigDecimal amount;

    @Column(name="income_date",nullable = false)
    private LocalDate incomeDate;

    @CreationTimestamp
    @Column(name="created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt;

}
