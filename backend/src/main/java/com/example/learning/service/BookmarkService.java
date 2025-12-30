package com.example.learning.service;

import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.PostResponse;
import org.springframework.data.domain.Pageable;

public interface BookmarkService {
    void bookmarkPost(Long userId, Long postId);

    void unbookmarkPost(Long userId, Long postId);

    PageResponse<PostResponse> getBookmarkedPosts(Long userId, Pageable pageable);

    boolean isBookmarked(Long userId, Long postId);
}
