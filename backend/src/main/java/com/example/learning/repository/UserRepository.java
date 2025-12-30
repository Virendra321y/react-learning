package com.example.learning.repository;

import com.example.learning.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE " +
            "(LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND u.deletedAt IS NULL")
    Page<User> searchUsers(@Param("query") String query, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL")
    Page<User> findAllActive(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND u.id = :id")
    Optional<User> findByIdActive(@Param("id") Long id);

    @Query("SELECT CASE WHEN COUNT(f1) > 0 AND COUNT(f2) > 0 THEN true ELSE false END " +
            "FROM User u1 " +
            "LEFT JOIN u1.following f1 ON f1.id = :userId2 " +
            "LEFT JOIN User u2 ON u2.id = :userId2 " +
            "LEFT JOIN u2.following f2 ON f2.id = :userId1 " +
            "WHERE u1.id = :userId1")
    boolean areMutualFollowers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
