package com.example.learning.controller;

import com.example.learning.dto.response.ApiResponse;
import com.example.learning.dto.response.ConversationResponse;
import com.example.learning.dto.response.MessageResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.service.ChatService;
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

/**
 * Chat Controller
 * REST endpoints for chat functionality
 */
@RestController
@RequestMapping("/api/v1/chat")
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    /**
     * Get all conversations for current user
     */
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<PageResponse<ConversationResponse>>> getConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {

        Long userId = getCurrentUserId(authentication);
        log.info("Fetching conversations for user {}", userId);

        Pageable pageable = PageRequest.of(page, size);
        PageResponse<ConversationResponse> data = chatService.getConversations(userId, pageable);

        ApiResponse<PageResponse<ConversationResponse>> response = ApiResponse
                .<PageResponse<ConversationResponse>>builder()
                .success(true)
                .message("Conversations retrieved successfully")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get messages in a conversation
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<PageResponse<MessageResponse>>> getMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            Authentication authentication) {

        Long userId = getCurrentUserId(authentication);
        log.info("Fetching messages for conversation {} by user {}", conversationId, userId);

        Pageable pageable = PageRequest.of(page, size);
        PageResponse<MessageResponse> data = chatService.getMessages(conversationId, userId, pageable);

        ApiResponse<PageResponse<MessageResponse>> response = ApiResponse.<PageResponse<MessageResponse>>builder()
                .success(true)
                .message("Messages retrieved successfully")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Mark messages in a conversation as read
     */
    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long conversationId,
            Authentication authentication) {

        Long userId = getCurrentUserId(authentication);
        log.info("Marking messages as read in conversation {} for user {}", conversationId, userId);

        chatService.markAsRead(conversationId, userId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Messages marked as read")
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get total unread message count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(Authentication authentication) {

        Long userId = getCurrentUserId(authentication);
        log.info("Fetching unread count for user {}", userId);

        Long unreadCount = chatService.getUnreadCount(userId);

        ApiResponse<Long> response = ApiResponse.<Long>builder()
                .success(true)
                .message("Unread count retrieved")
                .data(unreadCount)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Check if current user can chat with another user
     */
    @GetMapping("/can-chat/{userId}")
    public ResponseEntity<ApiResponse<Boolean>> canChatWith(
            @PathVariable Long userId,
            Authentication authentication) {

        Long currentUserId = getCurrentUserId(authentication);
        log.info("Checking if user {} can chat with user {}", currentUserId, userId);

        boolean canChat = chatService.canChatWith(currentUserId, userId);

        ApiResponse<Boolean> response = ApiResponse.<Boolean>builder()
                .success(true)
                .message("Chat permission check")
                .data(canChat)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private Long getCurrentUserId(Authentication authentication) {
        return userService.getCurrentUser(authentication.getName()).getId();
    }
}
