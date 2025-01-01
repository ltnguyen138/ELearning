package com.example.elearningbackend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, QuerydslPredicateExecutor<User> {

    Optional<User> findByEmail(String email);

    Optional<User> findByIdAndIsDeletedIsFalse(long id);

    Optional<User> findByEmailAndIsDeletedIsFalse(String email);

    boolean existsByEmailAndIsDeletedIsFalse(String email);

    Optional<User> findByEmailAndIsDeletedIsFalseAndIsVerifiedIsFalse(String email);

    boolean existsByEmailAndIsDeletedIsTrue(String email);
}
