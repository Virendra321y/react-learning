package com.example.learning.service.impl;

import com.example.learning.dto.request.ChangePasswordRequest;
import com.example.learning.dto.request.UpdateUserRequest;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.UserResponse;
import com.example.learning.dto.response.UserStatisticsResponse;
import com.example.learning.entity.User;
import com.example.learning.exception.ResourceNotFoundException;
import com.example.learning.exception.UnauthorizedException;
import com.example.learning.repository.CommentRepository;
import com.example.learning.repository.PostRepository;
import com.example.learning.repository.UserRepository;
import com.example.learning.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAllActive(pageable);
        return mapToPageResponse(users);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToUserResponse(user);
    }

    @Override
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new UnauthorizedException("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> searchUsers(String query, Pageable pageable, Long currentUserId) {
        Page<User> users = userRepository.searchUsers(query, pageable);
        return mapToPageResponse(users, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        // For current user, isFollowing is null or false (you don't follow yourself
        // usually)
        return mapToUserResponse(user, null);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserStatisticsResponse getUserStatistics(Long userId) {
        User user = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Integer totalPosts = postRepository.countByAuthorId(userId);
        Integer totalComments = commentRepository.countByAuthorId(userId);
        Long accountAge = ChronoUnit.DAYS.between(user.getCreatedAt(), LocalDateTime.now());

        return UserStatisticsResponse.builder()
                .userId(userId)
                .totalPosts(totalPosts != null ? totalPosts : 0)
                .totalComments(totalComments != null ? totalComments : 0)
                .totalLikes(0)
                .followersCount(user.getFollowers().size())
                .followingCount(user.getFollowing().size())
                .accountAge(accountAge.intValue())
                .lastLoginAt(LocalDateTime.now().toString())
                .accountStatus(user.getStatus().toString())
                .build();
    }

    @Override
    public void followUser(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("Users cannot follow themselves");
        }

        User follower = userRepository.findByIdActive(followerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", followerId));
        User following = userRepository.findByIdActive(followingId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", followingId));

        follower.getFollowing().add(following);
        userRepository.save(follower);
        log.info("User {} started following user {}", followerId, followingId);
    }

    @Override
    public void unfollowUser(Long followerId, Long followingId) {
        User follower = userRepository.findByIdActive(followerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", followerId));
        User following = userRepository.findByIdActive(followingId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", followingId));

        follower.getFollowing().remove(following);
        userRepository.save(follower);
        log.info("User {} unfollowed user {}", followerId, followingId);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getFollowers(Long userId, Pageable pageable, Long currentUserId) {
        User user = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), user.getFollowers().size());

        java.util.List<User> content = user.getFollowers().stream().toList();
        if (start > content.size()) {
            return PageResponse.<UserResponse>builder()
                    .content(java.util.Collections.emptyList()).page(pageable.getPageNumber())
                    .size(pageable.getPageSize())
                    .totalElements(content.size())
                    .totalPages((int) Math.ceil((double) content.size() / pageable.getPageSize()))
                    .hasNext(false).hasPrevious(pageable.getPageNumber() > 0).build();
        }

        java.util.List<User> pagedList = content.subList(start, end);

        return PageResponse.<UserResponse>builder()
                .content(pagedList.stream().map(u -> mapToUserResponse(u, currentUserId)).toList())
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(content.size())
                .totalPages((int) Math.ceil((double) content.size() / pageable.getPageSize()))
                .hasNext(end < content.size())
                .hasPrevious(pageable.getPageNumber() > 0)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getFollowing(Long userId, Pageable pageable, Long currentUserId) {
        User user = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), user.getFollowing().size());

        java.util.List<User> content = user.getFollowing().stream().toList();

        if (start > content.size()) {
            return PageResponse.<UserResponse>builder()
                    .content(java.util.Collections.emptyList()).page(pageable.getPageNumber())
                    .size(pageable.getPageSize())
                    .totalElements(content.size())
                    .totalPages((int) Math.ceil((double) content.size() / pageable.getPageSize()))
                    .hasNext(false).hasPrevious(pageable.getPageNumber() > 0).build();
        }

        java.util.List<User> pagedList = content.subList(start, end);

        return PageResponse.<UserResponse>builder()
                .content(pagedList.stream().map(u -> mapToUserResponse(u, currentUserId)).toList())
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(content.size())
                .totalPages((int) Math.ceil((double) content.size() / pageable.getPageSize()))
                .hasNext(end < content.size())
                .hasPrevious(pageable.getPageNumber() > 0)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFollowing(Long followerId, Long followingId) {
        User follower = userRepository.findByIdActive(followerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", followerId));
        return follower.getFollowing().stream().anyMatch(u -> u.getId().equals(followingId));
    }

    private UserResponse mapToUserResponse(User user) {
        return mapToUserResponse(user, null);
    }

    private UserResponse mapToUserResponse(User user, Long currentUserId) {
        boolean isFollowing = false;
        if (currentUserId != null) {
            // Check if user (the target) is followed by currentUserId
            // i.e. Does currentUser follow user?
            // Expensive check if we don't optimize, but with lazy loading via JPA standard
            // + ID check it's okay for now.
            // Better: currentUser.getFollowing().contains(user).
            // But we don't have currentUser object here easily without fetching it.
            // OR we check user.getFollowers().contains(currentUser).
            // Let's use the helper method isFollowing(currentUserId, user.getId())
            // But that fetches follower again.
            // Optimized: We fetch currentUser ONCE in the controller/service method and
            // pass Set<Long> followingIds?
            // For now, let's just do the check user.getFollowers().stream().anyMatch(...)
            // This is N+1 but on a small scale. Safe for "Startup" phase.
            isFollowing = user.getFollowers().stream().anyMatch(f -> f.getId().equals(currentUserId));
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .status(user.getStatus().toString())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .isFollowing(isFollowing) // Set the field
                .build();
    }

    private PageResponse<UserResponse> mapToPageResponse(Page<User> page) {
        return mapToPageResponse(page, null);
    }

    private PageResponse<UserResponse> mapToPageResponse(Page<User> page, Long currentUserId) {
        return PageResponse.<UserResponse>builder()
                .content(page.getContent().stream()
                        .map(u -> mapToUserResponse(u, currentUserId))
                        .toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}
