package com.example.learning.service;

import com.example.learning.dto.request.CreatePostRequest;
import com.example.learning.dto.request.UpdatePostRequest;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.PostResponse;
import org.springframework.data.domain.Pageable;

public interface PostService {
    PostResponse createPost(Long userId, CreatePostRequest request);
    PageResponse<PostResponse> getAllPosts(Pageable pageable);
    PostResponse getPostById(Long postId);
    PostResponse updatePost(Long postId, Long userId, UpdatePostRequest request);
    void deletePost(Long postId, Long userId);
    PageResponse<PostResponse> getPostsByUser(Long userId, Pageable pageable);
    PageResponse<PostResponse> searchPosts(String query, Pageable pageable);
}
