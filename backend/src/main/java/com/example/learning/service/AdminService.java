package com.example.learning.service;

import com.example.learning.dto.response.AdminStatsResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.UserResponse;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    AdminStatsResponse getStats();

    PageResponse<UserResponse> getAllUsers(Pageable pageable);

    void updateUserStatus(Long userId, String status);

    void recordTraffic(String ipAddress, String endpoint);
}
