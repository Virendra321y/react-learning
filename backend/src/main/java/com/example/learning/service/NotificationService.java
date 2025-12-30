package com.example.learning.service;

import com.example.learning.dto.response.NotificationResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.entity.User;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    void createNotification(User recipient, User sender, String type, String message, String targetUrl);

    PageResponse<NotificationResponse> getNotifications(Long userId, Pageable pageable);

    void markAsRead(Long notificationId, Long userId);

    void markAllAsRead(Long userId);

    long getUnreadCount(Long userId);

    void deleteNotification(Long notificationId, Long userId);
}
