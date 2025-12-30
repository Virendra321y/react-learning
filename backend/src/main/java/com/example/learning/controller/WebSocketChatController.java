package com.example.learning.controller;

import com.example.learning.dto.request.MessageRequest;
import com.example.learning.dto.response.ChatNotificationResponse;
import com.example.learning.dto.response.MessageResponse;
import com.example.learning.entity.User;
import com.example.learning.exception.ResourceNotFoundException;
import com.example.learning.repository.UserRepository;
import com.example.learning.service.ChatService;
import com.example.learning.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

/**
 * WebSocket Chat Controller
 * Handles real-time chat messages via WebSocket
 */
@Controller
@Slf4j
public class WebSocketChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Handle incoming chat messages via WebSocket
     * Endpoint: /app/chat.send
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageRequest request, Authentication authentication) {
        try {
            // Get sender ID from authentication
            Long senderId = userService.getCurrentUser(authentication.getName()).getId();

            log.info("WebSocket message from user {} to user {}", senderId, request.getReceiverId());

            // Send message (includes mutual follow validation)
            MessageResponse messageResponse = chatService.sendMessage(senderId, request);

            // Send to receiver via WebSocket
            ChatNotificationResponse notification = ChatNotificationResponse.builder()
                    .message(messageResponse)
                    .conversationId(messageResponse.getConversationId())
                    .senderId(senderId)
                    .senderName(messageResponse.getSenderName())
                    .timestamp(LocalDateTime.now())
                    .build();

            // Get receiver details to get their email (Principal name)
            User receiver = userRepository.findById(request.getReceiverId())
                    .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

            // Send to receiver via WebSocket (using their email as Principal name)
            messagingTemplate.convertAndSendToUser(
                    receiver.getEmail(),
                    "/queue/messages",
                    notification);

            // Also send back to sender for confirmation (using their authentication
            // name/email)
            messagingTemplate.convertAndSendToUser(
                    authentication.getName(),
                    "/queue/messages",
                    notification);

            log.info("Message sent successfully via WebSocket");

        } catch (Exception e) {
            log.error("Error sending WebSocket message: {}", e.getMessage(), e);
            // Send error back to sender
            messagingTemplate.convertAndSendToUser(
                    authentication.getName(),
                    "/queue/errors",
                    "Failed to send message: " + e.getMessage());
        }
    }
}
