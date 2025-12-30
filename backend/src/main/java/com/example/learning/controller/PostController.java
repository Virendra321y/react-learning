package com.example.learning.controller;

import com.example.learning.dto.request.CreatePostRequest;
import com.example.learning.dto.request.UpdatePostRequest;
import com.example.learning.dto.response.ApiResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.PostResponse;
import com.example.learning.service.PostService;
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
@RequestMapping("/api/v1/posts")
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class PostController {

        @Autowired
        private PostService postService;

        @Autowired
        private com.example.learning.service.UserService userService;

        @PostMapping
        public ResponseEntity<ApiResponse<PostResponse>> createPost(
                        @Valid @RequestBody CreatePostRequest request,
                        Authentication authentication) {

                log.info("Creating new post");
                Long userId = extractUserIdFromAuthentication(authentication);
                PostResponse data = postService.createPost(userId, request);

                ApiResponse<PostResponse> response = ApiResponse.<PostResponse>builder()
                                .success(true)
                                .message("Post created successfully")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        @GetMapping
        public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getAllPosts(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "createdAt") String sort,
                        @RequestParam(defaultValue = "DESC") Sort.Direction direction,
                        Authentication authentication) {

                Long currentUserId = extractUserIdFromAuthentication(authentication);
                Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
                PageResponse<PostResponse> data = postService.getAllPosts(pageable, currentUserId);

                ApiResponse<PageResponse<PostResponse>> response = ApiResponse.<PageResponse<PostResponse>>builder()
                                .success(true)
                                .message("Posts retrieved successfully")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/{postId}")
        public ResponseEntity<ApiResponse<PostResponse>> getPostById(@PathVariable Long postId) {
                log.info("Fetching post: {}", postId);
                PostResponse data = postService.getPostById(postId);

                ApiResponse<PostResponse> response = ApiResponse.<PostResponse>builder()
                                .success(true)
                                .message("Post retrieved successfully")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PutMapping("/{postId}")
        public ResponseEntity<ApiResponse<PostResponse>> updatePost(
                        @PathVariable Long postId,
                        @Valid @RequestBody UpdatePostRequest request,
                        Authentication authentication) {

                log.info("Updating post: {}", postId);
                Long userId = extractUserIdFromAuthentication(authentication);
                PostResponse data = postService.updatePost(postId, userId, request);

                ApiResponse<PostResponse> response = ApiResponse.<PostResponse>builder()
                                .success(true)
                                .message("Post updated successfully")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @DeleteMapping("/{postId}")
        public ResponseEntity<ApiResponse<Void>> deletePost(
                        @PathVariable Long postId,
                        Authentication authentication) {

                log.info("Deleting post: {}", postId);
                Long userId = extractUserIdFromAuthentication(authentication);
                postService.deletePost(postId, userId);

                ApiResponse<Void> response = ApiResponse.<Void>builder()
                                .success(true)
                                .message("Post deleted successfully")
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/user/{userId}")
        public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getPostsByUser(
                        @PathVariable Long userId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        Authentication authentication) {

                log.info("Fetching posts for user: {}", userId);
                Long currentUserId = extractUserIdFromAuthentication(authentication);

                Pageable pageable = PageRequest.of(page, size);
                PageResponse<PostResponse> data = postService.getPostsByUser(userId, currentUserId, pageable);

                ApiResponse<PageResponse<PostResponse>> response = ApiResponse.<PageResponse<PostResponse>>builder()
                                .success(true)
                                .message("User posts retrieved successfully")
                                .data(data)
                                .timestamp(LocalDateTime.now())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        private Long extractUserIdFromAuthentication(Authentication authentication) {
                if (authentication == null) {
                        // Should be handled by Security filter, but as a safeguard
                        throw new com.example.learning.exception.UnauthorizedException("User is not authenticated");
                }
                return userService.getCurrentUser(authentication.getName()).getId();
        }
}
