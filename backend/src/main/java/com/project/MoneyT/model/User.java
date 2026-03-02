package com.project.MoneyT.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private Long userId;

    @Column(name="username",nullable = false,length = 50)
    private String username;

    @Column(name="email",nullable = false,length = 100)
    private String email;

    @Column(name="password_hash",nullable = false,length = 255)
    private String passwordHash;

    @CreationTimestamp
    @Column(name="created_at",nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Expense> expenses ;

    @OneToMany(mappedBy = "user",cascade =CascadeType.ALL,orphanRemoval = true)
    private List<Budget>  budgets;

    public User(){}

    public User(String username,String email,String passwordHash){
        this.username=username;
        this.email=email;
        this.passwordHash = passwordHash;
    }

}
