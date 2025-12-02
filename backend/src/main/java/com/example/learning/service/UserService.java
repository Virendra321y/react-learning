package com.example.learning.service;

import com.example.learning.dto.request.ChangePasswordRequest;
import com.example.learning.dto.request.UpdateUserRequest;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.UserResponse;
import com.example.learning.dto.response.UserStatisticsResponse;
import org.springframework.data.domain.Pageable;

public interface UserService {
    PageResponse<UserResponse> getAllUsers(Pageable pageable);
    UserResponse getUserById(Long userId);
    UserResponse updateUser(Long userId, UpdateUserRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
    PageResponse<UserResponse> searchUsers(String query, Pageable pageable);
    UserResponse getCurrentUser(String email);
    void deleteUser(Long userId);
    UserStatisticsResponse getUserStatistics(Long userId);
}
