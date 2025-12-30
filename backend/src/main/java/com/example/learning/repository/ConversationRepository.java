package com.example.learning.repository;

import com.example.learning.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Conversation Repository
 * Handles database operations for conversations
 */
@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    /**
     * Find all conversations for a specific user
     */
    @Query("SELECT c FROM Conversation c WHERE c.user1Id = :userId OR c.user2Id = :userId " +
            "ORDER BY c.lastMessageTime DESC")
    Page<Conversation> findByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * Find conversation between two users (order independent)
     */
    @Query("SELECT c FROM Conversation c WHERE " +
            "(c.user1Id = :user1Id AND c.user2Id = :user2Id) OR " +
            "(c.user1Id = :user2Id AND c.user2Id = :user1Id)")
    Optional<Conversation> findConversationBetweenUsers(@Param("user1Id") Long user1Id,
            @Param("user2Id") Long user2Id);
}
