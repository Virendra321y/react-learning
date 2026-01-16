package com.example.learning.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatisticsResponse {
    private Long userId;
    private Integer totalPosts;
    private Integer totalComments;
    private Integer totalLikes;
    private Integer followersCount;
    private Integer followingCount;
    private Integer accountAge;
    private String lastLoginAt;
    private String accountStatus;
}
