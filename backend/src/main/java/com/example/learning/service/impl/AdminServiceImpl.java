package com.example.learning.service.impl;

import com.example.learning.dto.response.AdminStatsResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.UserResponse;
import com.example.learning.entity.Traffic;
import com.example.learning.entity.User;
import com.example.learning.exception.ResourceNotFoundException;
import com.example.learning.repository.*;
import com.example.learning.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final TrafficRepository trafficRepository;

    @Override
    public AdminStatsResponse getStats() {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);

        long totalUsers = userRepository.count();
        long totalPosts = postRepository.count();
        long totalComments = commentRepository.count();
        long traffic24h = trafficRepository.countByTimestampAfter(yesterday);
        long visitors24h = trafficRepository.countUniqueVisitorsAfter(yesterday);

        // Calculate distribution (simple example)
        Map<String, Long> distribution = new HashMap<>();
        for (User.UserStatus status : User.UserStatus.values()) {
            // This is inefficient for many users, but fine for a small project
            // Ideally use a custom query for this
            distribution.put(status.name(), userRepository.findAll().stream()
                    .filter(u -> u.getStatus() == status).count());
        }

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalPosts(totalPosts)
                .totalComments(totalComments)
                .totalTraffic24h(traffic24h)
                .uniqueVisitors24h(visitors24h)
                .userStatusDistribution(distribution)
                .build();
    }

    @Override
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);

        List<UserResponse> content = userPage.getContent().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());

        return PageResponse.<UserResponse>builder()
                .content(content)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .hasNext(userPage.hasNext())
                .hasPrevious(userPage.hasPrevious())
                .build();
    }

    @Override
    @Transactional
    public void updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setStatus(User.UserStatus.valueOf(status.toUpperCase()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void recordTraffic(String ipAddress, String endpoint) {
        Traffic traffic = Traffic.builder()
                .ipAddress(ipAddress)
                .endpoint(endpoint)
                .build();
        trafficRepository.save(traffic);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .status(user.getStatus().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
