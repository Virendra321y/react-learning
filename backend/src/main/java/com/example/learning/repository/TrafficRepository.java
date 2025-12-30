package com.example.learning.repository;

import com.example.learning.entity.Traffic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrafficRepository extends JpaRepository<Traffic, Long> {
    long countByTimestampAfter(LocalDateTime timestamp);

    @Query("SELECT COUNT(DISTINCT t.ipAddress) FROM Traffic t WHERE t.timestamp > :timestamp")
    long countUniqueVisitorsAfter(LocalDateTime timestamp);

    @Query("SELECT CAST(t.timestamp AS DATE) as date, EXTRACT(HOUR FROM t.timestamp) as hour, COUNT(t) FROM Traffic t WHERE t.timestamp > :timestamp GROUP BY CAST(t.timestamp AS DATE), EXTRACT(HOUR FROM t.timestamp) ORDER BY date, hour")
    List<Object[]> findTrafficCountsByHourAfter(LocalDateTime timestamp);
}
