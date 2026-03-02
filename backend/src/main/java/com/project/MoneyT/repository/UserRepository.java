package com.project.MoneyT.repository;

import com.project.MoneyT.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

     Optional<User> findByEmail(String email) throws UsernameNotFoundException;
     User findByUsername(String username);
     boolean existsByEmail(String email);
     boolean existsByUsername(String username);
}
