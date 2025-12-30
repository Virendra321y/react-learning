package com.example.learning.service.impl;

import com.example.learning.dto.request.MessageRequest;
import com.example.learning.dto.response.ConversationResponse;
import com.example.learning.dto.response.MessageResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.ReadReceiptResponse;
import com.example.learning.entity.Conversation;
import com.example.learning.entity.Message;
import com.example.learning.entity.User;
import com.example.learning.exception.ResourceNotFoundException;
import com.example.learning.exception.UnauthorizedException;
import com.example.learning.repository.ConversationRepository;
import com.example.learning.repository.MessageRepository;
import com.example.learning.repository.UserRepository;
import com.example.learning.service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Chat Service Implementation
 * Implements chat business logic with mutual follow validation
 */
@Service
@Slf4j
public class ChatServiceImpl implements ChatService {

        @Autowired
        private MessageRepository messageRepository;

        @Autowired
        private ConversationRepository conversationRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private SimpMessagingTemplate messagingTemplate;

        @Override
        public boolean validateMutualFollow(Long user1Id, Long user2Id) {
                return userRepository.areMutualFollowers(user1Id, user2Id);
        }

        @Override
        @Transactional
        public MessageResponse sendMessage(Long senderId, MessageRequest request) {
                log.info("Sending message from user {} to user {}", senderId, request.getReceiverId());

                // Validate mutual follow
                if (!validateMutualFollow(senderId, request.getReceiverId())) {
                        throw new UnauthorizedException("You can only send messages to users who mutually follow you");
                }

                // Get or create conversation
                Conversation conversation = getOrCreateConversation(senderId, request.getReceiverId());

                // Get sender and receiver details
                User sender = userRepository.findById(senderId)
                                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
                User receiver = userRepository.findById(request.getReceiverId())
                                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

                // Create message
                Message message = Message.builder()
                                .senderId(senderId)
                                .receiverId(request.getReceiverId())
                                .conversationId(conversation.getId())
                                .content(request.getContent())
                                .timestamp(LocalDateTime.now())
                                .readStatus(false)
                                .build();

                message = messageRepository.save(message);

                // Update conversation
                conversation.setLastMessageTime(message.getTimestamp());
                conversation.setLastMessageContent(
                                message.getContent().length() > 100
                                                ? message.getContent().substring(0, 100) + "..."
                                                : message.getContent());
                conversationRepository.save(conversation);

                // Build response
                return MessageResponse.builder()
                                .id(message.getId())
                                .senderId(senderId)
                                .senderName(sender.getUsername())
                                .senderAvatar(sender.getAvatar())
                                .receiverId(request.getReceiverId())
                                .receiverName(receiver.getUsername())
                                .receiverAvatar(receiver.getAvatar())
                                .content(message.getContent())
                                .timestamp(message.getTimestamp())
                                .readStatus(message.getReadStatus())
                                .conversationId(conversation.getId())
                                .build();
        }

        @Override
        public PageResponse<ConversationResponse> getConversations(Long userId, Pageable pageable) {
                log.info("Fetching conversations for user {}", userId);

                Page<Conversation> conversationPage = conversationRepository.findByUserId(userId, pageable);

                List<ConversationResponse> conversations = conversationPage.getContent().stream()
                                .map(conv -> buildConversationResponse(conv, userId))
                                .collect(Collectors.toList());

                return PageResponse.<ConversationResponse>builder()
                                .content(conversations)
                                .page(conversationPage.getNumber())
                                .size(conversationPage.getSize())
                                .totalElements(conversationPage.getTotalElements())
                                .totalPages(conversationPage.getTotalPages())
                                .hasNext(conversationPage.hasNext())
                                .hasPrevious(conversationPage.hasPrevious())
                                .build();
        }

        @Override
        public PageResponse<MessageResponse> getMessages(Long conversationId, Long userId, Pageable pageable) {
                log.info("Fetching messages for conversation {} by user {}", conversationId, userId);

                // Verify user is part of conversation
                Conversation conversation = conversationRepository.findById(conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

                if (!conversation.getUser1Id().equals(userId) && !conversation.getUser2Id().equals(userId)) {
                        throw new UnauthorizedException("You are not part of this conversation");
                }

                Page<Message> messagePage = messageRepository.findByConversationIdOrderByTimestampAsc(
                                conversationId, pageable);

                List<MessageResponse> messages = messagePage.getContent().stream()
                                .map(this::buildMessageResponse)
                                .collect(Collectors.toList());

                return PageResponse.<MessageResponse>builder()
                                .content(messages)
                                .page(messagePage.getNumber())
                                .size(messagePage.getSize())
                                .totalElements(messagePage.getTotalElements())
                                .totalPages(messagePage.getTotalPages())
                                .hasNext(messagePage.hasNext())
                                .hasPrevious(messagePage.hasPrevious())
                                .build();
        }

        @Override
        @Transactional
        public void markAsRead(Long conversationId, Long userId) {
                log.info("Marking messages as read in conversation {} for user {}", conversationId, userId);

                // Verify user is part of conversation
                Conversation conversation = conversationRepository.findById(conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

                if (!conversation.getUser1Id().equals(userId) && !conversation.getUser2Id().equals(userId)) {
                        throw new UnauthorizedException("You are not part of this conversation");
                }

                messageRepository.markMessagesAsRead(conversationId, userId);

                // Notify the other user about read status
                try {
                        Long otherUserId = conversation.getUser1Id().equals(userId)
                                        ? conversation.getUser2Id()
                                        : conversation.getUser1Id();

                        User otherUser = userRepository.findById(otherUserId)
                                        .orElseThrow(() -> new ResourceNotFoundException("Other user not found"));

                        ReadReceiptResponse receipt = ReadReceiptResponse.builder()
                                        .conversationId(conversationId)
                                        .readerId(userId)
                                        .build();

                        messagingTemplate.convertAndSendToUser(
                                        otherUser.getEmail(),
                                        "/queue/read-receipts",
                                        receipt);

                        log.info("Read receipt sent to user {}", otherUser.getEmail());
                } catch (Exception e) {
                        log.error("Error sending read receipt: {}", e.getMessage());
                }
        }

        @Override
        public Long getUnreadCount(Long userId) {
                return messageRepository.countUnreadMessagesByReceiverId(userId);
        }

        @Override
        public boolean canChatWith(Long userId, Long otherUserId) {
                return validateMutualFollow(userId, otherUserId);
        }

        /**
         * Get existing conversation or create new one
         */
        private Conversation getOrCreateConversation(Long user1Id, Long user2Id) {
                return conversationRepository.findConversationBetweenUsers(user1Id, user2Id)
                                .orElseGet(() -> {
                                        // Ensure consistent ordering (smaller ID first)
                                        Long smallerId = Math.min(user1Id, user2Id);
                                        Long largerId = Math.max(user1Id, user2Id);

                                        Conversation newConversation = Conversation.builder()
                                                        .user1Id(smallerId)
                                                        .user2Id(largerId)
                                                        .build();

                                        return conversationRepository.save(newConversation);
                                });
        }

        /**
         * Build conversation response with other user details
         */
        private ConversationResponse buildConversationResponse(Conversation conversation, Long currentUserId) {
                // Determine the other user
                Long otherUserId = conversation.getUser1Id().equals(currentUserId)
                                ? conversation.getUser2Id()
                                : conversation.getUser1Id();

                User otherUser = userRepository.findById(otherUserId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                // Get unread count for this conversation
                Long unreadCount = messageRepository.countUnreadMessagesInConversation(
                                conversation.getId(), currentUserId);

                return ConversationResponse.builder()
                                .id(conversation.getId())
                                .otherUserId(otherUserId)
                                .otherUserName(otherUser.getUsername())
                                .otherUserAvatar(otherUser.getAvatar())
                                .lastMessage(conversation.getLastMessageContent())
                                .lastMessageTime(conversation.getLastMessageTime())
                                .unreadCount(unreadCount)
                                .build();
        }

        /**
         * Build message response with user details
         */
        private MessageResponse buildMessageResponse(Message message) {
                User sender = userRepository.findById(message.getSenderId())
                                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
                User receiver = userRepository.findById(message.getReceiverId())
                                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

                return MessageResponse.builder()
                                .id(message.getId())
                                .senderId(message.getSenderId())
                                .senderName(sender.getUsername())
                                .senderAvatar(sender.getAvatar())
                                .receiverId(message.getReceiverId())
                                .receiverName(receiver.getUsername())
                                .receiverAvatar(receiver.getAvatar())
                                .content(message.getContent())
                                .timestamp(message.getTimestamp())
                                .readStatus(message.getReadStatus())
                                .conversationId(message.getConversationId())
                                .build();
        }
}
