package com.example.elearningbackend.category;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, QuerydslPredicateExecutor<Category> {

    Optional<Category> findByIdAndIsDeletedIsFalse(long id);

    boolean existsByNameAndIsDeletedIsFalse(@NotNull String name);

    boolean existsByAlias(@NotNull String alias);

    boolean existsByAliasAndIsDeletedIsFalse(@NotNull String alias);

    Optional<Category> findByAlias(@NotNull String alias);
}
