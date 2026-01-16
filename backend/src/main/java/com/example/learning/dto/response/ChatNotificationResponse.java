package com.example.learning.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Chat Notification Response DTO
 * Real-time notification for new messages
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatNotificationResponse {

    private MessageResponse message;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private LocalDateTime timestamp;
}
