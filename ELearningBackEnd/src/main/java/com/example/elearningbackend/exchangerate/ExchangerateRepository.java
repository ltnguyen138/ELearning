package com.example.elearningbackend.exchangerate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ExchangerateRepository extends JpaRepository<Exchangerate, Long> {

    Optional<Exchangerate> findFirstByDate(LocalDate date);
}
