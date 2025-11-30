package com.example.learning.service;

import com.example.learning.dto.request.CreateCommentRequest;
import com.example.learning.dto.response.CommentResponse;
import com.example.learning.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface CommentService {
    CommentResponse createComment(Long postId, Long userId, CreateCommentRequest request);
    PageResponse<CommentResponse> getCommentsByPost(Long postId, Pageable pageable);
    CommentResponse updateComment(Long commentId, Long userId, CreateCommentRequest request);
    void deleteComment(Long commentId, Long userId);
}
