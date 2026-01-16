package com.example.learning.repository;

import com.example.learning.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Message Repository
 * Handles database operations for chat messages
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Find messages by conversation ID ordered by timestamp
     */
    Page<Message> findByConversationIdOrderByTimestampAsc(Long conversationId, Pageable pageable);

    /**
     * Count unread messages for a specific receiver
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiverId = :receiverId AND m.readStatus = false")
    Long countUnreadMessagesByReceiverId(@Param("receiverId") Long receiverId);

    /**
     * Count unread messages in a specific conversation for a user
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversationId = :conversationId " +
            "AND m.receiverId = :userId AND m.readStatus = false")
    Long countUnreadMessagesInConversation(@Param("conversationId") Long conversationId,
            @Param("userId") Long userId);

    /**
     * Mark all messages in a conversation as read for a specific user
     */
    @Modifying
    @Query("UPDATE Message m SET m.readStatus = true WHERE m.conversationId = :conversationId " +
            "AND m.receiverId = :userId AND m.readStatus = false")
    void markMessagesAsRead(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
}
