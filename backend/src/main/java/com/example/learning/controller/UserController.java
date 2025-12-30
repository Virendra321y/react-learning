package com.example.learning.controller;

import com.example.learning.dto.request.ChangePasswordRequest;
import com.example.learning.dto.request.UpdateUserRequest;
import com.example.learning.dto.response.ApiResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.UserResponse;
import com.example.learning.dto.response.UserStatisticsResponse;
import com.example.learning.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/users")
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class UserController {

        @Autowired
        private UserService userService;

        @Autowired
        private com.example.learning.service.PostService postService;

        @GetMapping
        public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "createdAt") String sort,
                        @RequestParam(defaultValue = "DESC") Sort.Direction direction) {

                Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
                PageResponse<UserResponse> data = userService.getAllUsers(pageable);

                ApiResponse<PageResponse<UserResponse>> response = ApiResponse.<PageResponse<UserResponse>>builder()
                                .success(true)
                                .message("Users retrieved successfully")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/{userId}")
        public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long userId) {
                log.info("Fetching user: {}", userId);
                UserResponse data = userService.getUserById(userId);

                ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                                .success(true)
                                .message("User retrieved successfully")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PutMapping("/{userId}")
        public ResponseEntity<ApiResponse<UserResponse>> updateUser(
                        @PathVariable Long userId,
                        @Valid @RequestBody UpdateUserRequest request) {

                log.info("Updating user: {}", userId);
                UserResponse data = userService.updateUser(userId, request);

                ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                                .success(true)
                                .message("User updated successfully")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PutMapping("/{userId}/password")
        public ResponseEntity<ApiResponse<Void>> changePassword(
                        @PathVariable Long userId,
                        @Valid @RequestBody ChangePasswordRequest request) {

                log.info("Changing password for user: {}", userId);
                userService.changePassword(userId, request);

                ApiResponse<Void> response = ApiResponse.<Void>builder()
                                .success(true)
                                .message("Password updated successfully")
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/search")
        public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> searchUsers(
                        @RequestParam String q,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        Authentication authentication) {

                log.info("Searching users with query: {}", q);
                Long currentUserId = getCurrentUserId(authentication);
                Pageable pageable = PageRequest.of(page, size);
                PageResponse<UserResponse> data = userService.searchUsers(q, pageable, currentUserId);

                ApiResponse<PageResponse<UserResponse>> response = ApiResponse.<PageResponse<UserResponse>>builder()
                                .success(true)
                                .message("Search results")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/me")
        public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
                log.info("Fetching current user");
                UserResponse data = userService.getCurrentUser(authentication.getName());

                ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                                .success(true)
                                .message("Current user retrieved successfully")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @DeleteMapping("/{userId}")
        public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
                log.info("Deleting user: {}", userId);
                userService.deleteUser(userId);

                ApiResponse<Void> response = ApiResponse.<Void>builder()
                                .success(true)
                                .message("User deleted successfully")
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/{userId}/statistics")
        public ResponseEntity<ApiResponse<UserStatisticsResponse>> getUserStatistics(@PathVariable Long userId) {
                log.info("Fetching statistics for user: {}", userId);
                UserStatisticsResponse data = userService.getUserStatistics(userId);

                ApiResponse<UserStatisticsResponse> response = ApiResponse.<UserStatisticsResponse>builder()
                                .success(true)
                                .message("User statistics retrieved")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PostMapping("/{userId}/follow")
        public ResponseEntity<ApiResponse<Void>> followUser(
                        @PathVariable Long userId,
                        Authentication authentication) {

                // We need the follower ID (current user)
                Long currentUserId = getCurrentUserId(authentication);
                log.info("User {} following {}", currentUserId, userId);

                userService.followUser(currentUserId, userId);

                ApiResponse<Void> response = ApiResponse.<Void>builder()
                                .success(true)
                                .message("User followed successfully")
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PostMapping("/{userId}/unfollow")
        public ResponseEntity<ApiResponse<Void>> unfollowUser(
                        @PathVariable Long userId,
                        Authentication authentication) {

                Long currentUserId = getCurrentUserId(authentication);
                log.info("User {} unfollowing {}", currentUserId, userId);

                userService.unfollowUser(currentUserId, userId);

                ApiResponse<Void> response = ApiResponse.<Void>builder()
                                .success(true)
                                .message("User unfollowed successfully")
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/{userId}/followers")
        public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getFollowers(
                        @PathVariable Long userId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        Authentication authentication) {

                Long currentUserId = getCurrentUserId(authentication);
                Pageable pageable = PageRequest.of(page, size);
                PageResponse<UserResponse> data = userService.getFollowers(userId, pageable, currentUserId);

                ApiResponse<PageResponse<UserResponse>> response = ApiResponse.<PageResponse<UserResponse>>builder()
                                .success(true)
                                .message("Followers retrieved")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/{userId}/following")
        public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getFollowing(
                        @PathVariable Long userId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        Authentication authentication) {

                Long currentUserId = getCurrentUserId(authentication);
                Pageable pageable = PageRequest.of(page, size);
                PageResponse<UserResponse> data = userService.getFollowing(userId, pageable, currentUserId);

                ApiResponse<PageResponse<UserResponse>> response = ApiResponse.<PageResponse<UserResponse>>builder()
                                .success(true)
                                .message("Following list retrieved")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/{userId}/posts")
        public ResponseEntity<ApiResponse<com.example.learning.dto.response.PageResponse<com.example.learning.dto.response.PostResponse>>> getUserPosts(
                        @PathVariable Long userId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        Authentication authentication) {

                log.info("Fetching posts for user: {}", userId);
                Long currentUserId = getCurrentUserId(authentication);

                Pageable pageable = PageRequest.of(page, size);
                com.example.learning.dto.response.PageResponse<com.example.learning.dto.response.PostResponse> data = postService
                                .getPostsByUser(userId, currentUserId, pageable);

                ApiResponse<com.example.learning.dto.response.PageResponse<com.example.learning.dto.response.PostResponse>> response = ApiResponse.<com.example.learning.dto.response.PageResponse<com.example.learning.dto.response.PostResponse>>builder()
                                .success(true)
                                .message("User posts retrieved successfully")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/{userId}/is-following")
        public ResponseEntity<ApiResponse<Boolean>> isFollowing(
                        @PathVariable Long userId,
                        Authentication authentication) {

                Long currentUserId = getCurrentUserId(authentication);
                boolean isFollowing = userService.isFollowing(currentUserId, userId);

                ApiResponse<Boolean> response = ApiResponse.<Boolean>builder()
                                .success(true)
                                .message("Follow status check")
                                .data(isFollowing)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        private Long getCurrentUserId(Authentication authentication) {
                if (authentication == null)
                        return null;
                return userService.getCurrentUser(authentication.getName()).getId();
        }
}
