package com.example.learning.service;

import com.example.learning.dto.request.MessageRequest;
import com.example.learning.dto.response.ConversationResponse;
import com.example.learning.dto.response.MessageResponse;
import com.example.learning.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

/**
 * Chat Service Interface
 * Defines chat-related business operations
 */
public interface ChatService {

    /**
     * Validate if two users mutually follow each other
     */
    boolean validateMutualFollow(Long user1Id, Long user2Id);

    /**
     * Send a message from sender to receiver
     */
    MessageResponse sendMessage(Long senderId, MessageRequest request);

    /**
     * Get all conversations for a user
     */
    PageResponse<ConversationResponse> getConversations(Long userId, Pageable pageable);

    /**
     * Get messages in a conversation
     */
    PageResponse<MessageResponse> getMessages(Long conversationId, Long userId, Pageable pageable);

    /**
     * Mark messages in a conversation as read
     */
    void markAsRead(Long conversationId, Long userId);

    /**
     * Get total unread message count for a user
     */
    Long getUnreadCount(Long userId);

    /**
     * Check if user can chat with another user (mutual follow)
     */
    boolean canChatWith(Long userId, Long otherUserId);
}
