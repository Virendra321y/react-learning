package com.example.learning.repository;

import com.example.learning.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.status = 'PUBLISHED'")
    Page<Post> findAllPublished(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.id = :id")
    Optional<Post> findByIdActive(@Param("id") Long id);

    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.author.id = :userId")
    Page<Post> findByAuthorId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.author.id = :userId AND p.deletedAt IS NULL")
    Integer countByAuthorId(@Param("userId") Long userId);

    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Post> searchPosts(@Param("query") String query, Pageable pageable);
}
