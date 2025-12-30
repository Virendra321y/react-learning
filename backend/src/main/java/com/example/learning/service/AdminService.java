package com.example.learning.service;

import com.example.learning.dto.response.AdminStatsResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.UserResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface AdminService {
    AdminStatsResponse getStats();

    PageResponse<UserResponse> getAllUsers(Pageable pageable);

    void updateUserStatus(Long userId, String status);

    void recordTraffic(String ipAddress, String endpoint, String userAgent, Long userId);

    List<Map<String, Object>> getTrafficChartData();
}
