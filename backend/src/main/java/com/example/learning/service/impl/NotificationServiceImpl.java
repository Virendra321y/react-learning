package com.example.learning.service.impl;

import com.example.learning.dto.response.NotificationResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.entity.Notification;
import com.example.learning.entity.User;
import com.example.learning.exception.ResourceNotFoundException;
import com.example.learning.repository.NotificationRepository;
import com.example.learning.repository.UserRepository;
import com.example.learning.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void createNotification(User recipient, User sender, String type, String message, String targetUrl) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .sender(sender)
                .type(type)
                .message(message)
                .targetUrl(targetUrl)
                .isRead(false)
                .build();

        Notification savedNotification = notificationRepository.save(notification);

        // Map to response DTO for WebSocket
        NotificationResponse response = mapToResponse(savedNotification);

        // Push via WebSocket
        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(),
                "/queue/notifications",
                response);

        log.info("Notification created and sent to user: {}", recipient.getEmail());
    }

    @Override
    public PageResponse<NotificationResponse> getNotifications(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<Notification> notificationPage = notificationRepository.findByRecipientOrderByCreatedAtDesc(user,
                pageable);

        List<NotificationResponse> content = notificationPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PageResponse.<NotificationResponse>builder()
                .content(content)
                .page(notificationPage.getNumber())
                .size(notificationPage.getSize())
                .totalElements(notificationPage.getTotalElements())
                .totalPages(notificationPage.getTotalPages())
                .hasNext(notificationPage.hasNext())
                .hasPrevious(notificationPage.hasPrevious())
                .build();
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found for current user");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Notification> unreadNotifications = notificationRepository.findByRecipientAndIsReadFalse(user);
        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    public long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found for current user");
        }

        notificationRepository.delete(notification);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        NotificationResponse.NotificationResponseBuilder builder = NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .targetUrl(notification.getTargetUrl())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt());

        if (notification.getSender() != null) {
            builder.senderId(notification.getSender().getId())
                    .senderName(notification.getSender().getUsername())
                    .senderAvatar(notification.getSender().getAvatar());
        }

        return builder.build();
    }
}
