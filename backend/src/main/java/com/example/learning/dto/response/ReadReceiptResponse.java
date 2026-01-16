package com.example.learning.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Read Receipt Response DTO
 * Notification sent when messages are read
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadReceiptResponse {
    private Long conversationId;
    private Long readerId;
}
