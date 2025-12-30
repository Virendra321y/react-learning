package com.example.learning.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Conversation Response DTO
 * Response containing conversation details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {

    private Long id;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserAvatar;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private Long unreadCount;
}
