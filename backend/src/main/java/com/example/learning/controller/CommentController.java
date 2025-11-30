package com.example.learning.controller;

import com.example.learning.dto.request.CreateCommentRequest;
import com.example.learning.dto.response.ApiResponse;
import com.example.learning.dto.response.CommentResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.service.CommentService;
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
@RequestMapping("/api/v1/posts/{postId}/comments")
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        
        log.info("Creating comment on post: {}", postId);
        Long userId = extractUserIdFromAuthentication(authentication);
        CommentResponse data = commentService.createComment(postId, userId, request);
        
        ApiResponse<CommentResponse> response = ApiResponse.<CommentResponse>builder()
                .success(true)
                .message("Comment created successfully")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CommentResponse>>> getCommentsByPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        PageResponse<CommentResponse> data = commentService.getCommentsByPost(postId, pageable);
        
        ApiResponse<PageResponse<CommentResponse>> response = ApiResponse.<PageResponse<CommentResponse>>builder()
                .success(true)
                .message("Comments retrieved successfully")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private Long extractUserIdFromAuthentication(Authentication authentication) {
        // Placeholder implementation
        return 1L;
    }
}

@RestController
@RequestMapping("/api/v1/comments")
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
class CommentDetailController {

    @Autowired
    private CommentService commentService;

    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        
        log.info("Updating comment: {}", commentId);
        Long userId = extractUserIdFromAuthentication(authentication);
        CommentResponse data = commentService.updateComment(commentId, userId, request);
        
        ApiResponse<CommentResponse> response = ApiResponse.<CommentResponse>builder()
                .success(true)
                .message("Comment updated successfully")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        
        log.info("Deleting comment: {}", commentId);
        Long userId = extractUserIdFromAuthentication(authentication);
        commentService.deleteComment(commentId, userId);
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Comment deleted successfully")
                .timestamp(LocalDateTime.now())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private Long extractUserIdFromAuthentication(Authentication authentication) {
        return 1L;
    }
}
