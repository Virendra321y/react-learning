package com.example.learning.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Message Response DTO
 * Response containing message details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private Long id;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private Long receiverId;
    private String receiverName;
    private String receiverAvatar;
    private String content;
    private LocalDateTime timestamp;
    private Boolean readStatus;
    private Long conversationId;
}
