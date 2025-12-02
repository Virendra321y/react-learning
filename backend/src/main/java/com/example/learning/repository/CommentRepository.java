package com.example.learning.repository;

import com.example.learning.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.deletedAt IS NULL AND c.post.id = :postId")
    Page<Comment> findByPostId(@Param("postId") Long postId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.deletedAt IS NULL AND c.id = :id")
    Optional<Comment> findByIdActive(@Param("id") Long id);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId AND c.deletedAt IS NULL")
    Integer countByPostId(@Param("postId") Long postId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.author.id = :userId AND c.deletedAt IS NULL")
    Integer countByAuthorId(@Param("userId") Long userId);

    @Query("SELECT c FROM Comment c WHERE c.deletedAt IS NULL AND c.author.id = :userId")
    Page<Comment> findByAuthorId(@Param("userId") Long userId, Pageable pageable);
}
