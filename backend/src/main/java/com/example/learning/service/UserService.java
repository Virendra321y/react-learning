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

    UserResponse updateAvatar(Long userId, org.springframework.web.multipart.MultipartFile file);

    void changePassword(Long userId, ChangePasswordRequest request);

    PageResponse<UserResponse> searchUsers(String query, Pageable pageable, Long currentUserId);

    UserResponse getCurrentUser(String email);

    void deleteUser(Long userId);

    UserStatisticsResponse getUserStatistics(Long userId);

    // Follow features
    void followUser(Long followerId, Long followingId);

    void unfollowUser(Long followerId, Long followingId);

    PageResponse<UserResponse> getFollowers(Long userId, Pageable pageable, Long currentUserId);

    PageResponse<UserResponse> getFollowing(Long userId, Pageable pageable, Long currentUserId);

    boolean isFollowing(Long followerId, Long followingId);
}
