package com.example.learning.service;

import com.example.learning.dto.request.CreatePostRequest;
import com.example.learning.dto.request.UpdatePostRequest;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.PostResponse;
import org.springframework.data.domain.Pageable;

public interface PostService {
    PostResponse createPost(Long userId, CreatePostRequest request);

    PageResponse<PostResponse> getAllPosts(Pageable pageable, Long currentUserId);

    PostResponse getPostById(Long postId, Long currentUserId);

    PostResponse updatePost(Long postId, Long userId, UpdatePostRequest request);

    void deletePost(Long postId, Long userId);

    PageResponse<PostResponse> getPostsByUser(Long userId, Long currentUserId, Pageable pageable);

    PageResponse<PostResponse> searchPosts(String query, Pageable pageable, Long currentUserId);

    void toggleLike(Long postId, Long userId);
}
