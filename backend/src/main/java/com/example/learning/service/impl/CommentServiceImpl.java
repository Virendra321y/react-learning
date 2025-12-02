package com.example.learning.service.impl;

import com.example.learning.dto.request.CreateCommentRequest;
import com.example.learning.dto.response.CommentResponse;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.UserResponse;
import com.example.learning.entity.Comment;
import com.example.learning.entity.Post;
import com.example.learning.entity.User;
import com.example.learning.exception.ResourceNotFoundException;
import com.example.learning.exception.UnauthorizedException;
import com.example.learning.repository.CommentRepository;
import com.example.learning.repository.PostRepository;
import com.example.learning.repository.UserRepository;
import com.example.learning.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@Slf4j
@Transactional
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public CommentResponse createComment(Long postId, Long userId, CreateCommentRequest request) {
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        User author = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .post(post)
                .author(author)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return mapToCommentResponse(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CommentResponse> getCommentsByPost(Long postId, Pageable pageable) {
        postRepository.findByIdActive(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Page<Comment> comments = commentRepository.findByPostId(postId, pageable);
        return mapToPageResponse(comments);
    }

    @Override
    public CommentResponse updateComment(Long commentId, Long userId, CreateCommentRequest request) {
        Comment comment = commentRepository.findByIdActive(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this comment");
        }

        comment.setContent(request.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return mapToCommentResponse(updatedComment);
    }

    @Override
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findByIdActive(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        comment.setDeletedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        UserResponse authorResponse = UserResponse.builder()
                .id(comment.getAuthor().getId())
                .username(comment.getAuthor().getUsername())
                .email(comment.getAuthor().getEmail())
                .avatar(comment.getAuthor().getAvatar())
                .build();

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(authorResponse)
                .postId(comment.getPost().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    private PageResponse<CommentResponse> mapToPageResponse(Page<Comment> page) {
        return PageResponse.<CommentResponse>builder()
                .content(page.getContent().stream()
                        .map(this::mapToCommentResponse)
                        .toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}
