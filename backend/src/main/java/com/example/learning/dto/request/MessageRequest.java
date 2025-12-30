package com.example.learning.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Message Request DTO
 * Request body for sending a chat message
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    @NotBlank(message = "Message content cannot be empty")
    @Size(min = 1, max = 5000, message = "Message must be between 1 and 5000 characters")
    private String content;
}
