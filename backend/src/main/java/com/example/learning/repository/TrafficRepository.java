package com.example.learning.repository;

import com.example.learning.entity.Traffic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TrafficRepository extends JpaRepository<Traffic, Long> {
    long countByTimestampAfter(LocalDateTime timestamp);

    @Query("SELECT COUNT(DISTINCT t.ipAddress) FROM Traffic t WHERE t.timestamp > :timestamp")
    long countUniqueVisitorsAfter(LocalDateTime timestamp);
}
