package com.example.learning.controller;

import com.example.learning.dto.response.ApiResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.PostResponse;
import com.example.learning.service.BookmarkService;
import com.example.learning.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/bookmarks")
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private UserService userService;

    @PostMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<Void>> bookmarkPost(@PathVariable Long postId, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        bookmarkService.bookmarkPost(userId, postId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Post bookmarked successfully")
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<Void>> unbookmarkPost(@PathVariable Long postId, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        bookmarkService.unbookmarkPost(userId, postId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Post unbookmarked successfully")
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getBookmarkedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        Long userId = getCurrentUserId(authentication);
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<PostResponse> data = bookmarkService.getBookmarkedPosts(userId, pageable);

        ApiResponse<PageResponse<PostResponse>> response = ApiResponse.<PageResponse<PostResponse>>builder()
                .success(true)
                .message("Bookmarked posts retrieved")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/post/{postId}/status")
    public ResponseEntity<ApiResponse<Boolean>> isBookmarked(@PathVariable Long postId, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        boolean isBookmarked = bookmarkService.isBookmarked(userId, postId);

        ApiResponse<Boolean> response = ApiResponse.<Boolean>builder()
                .success(true)
                .message("Bookmark status check")
                .data(isBookmarked)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private Long getCurrentUserId(Authentication authentication) {
        return userService.getCurrentUser(authentication.getName()).getId();
    }
}
