package com.example.learning.service.impl;

import com.example.learning.dto.request.CreatePostRequest;
import com.example.learning.dto.request.UpdatePostRequest;
import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.PostResponse;
import com.example.learning.dto.response.UserResponse;
import com.example.learning.entity.Post;
import com.example.learning.entity.User;
import com.example.learning.exception.ResourceNotFoundException;
import com.example.learning.exception.UnauthorizedException;
import com.example.learning.repository.CommentRepository;
import com.example.learning.repository.PostRepository;
import com.example.learning.repository.UserRepository;
import com.example.learning.repository.LikeRepository;
import com.example.learning.entity.Like;

import com.example.learning.service.PostService;
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
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Override
    public PostResponse createPost(Long userId, CreatePostRequest request) {
        User author = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .status(Post.PostStatus.valueOf(request.getStatus()))
                .author(author)
                .build();

        Post savedPost = postRepository.save(post);
        return mapToPostResponse(savedPost, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getAllPosts(Pageable pageable, Long currentUserId) {
        Page<Post> posts = postRepository.findFeedPosts(currentUserId, pageable);
        return mapToPageResponse(posts, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId, Long currentUserId) {
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        return mapToPostResponse(post, currentUserId);
    }

    @Override
    public PostResponse updatePost(Long postId, Long userId, UpdatePostRequest request) {
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        if (!post.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this post");
        }

        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }
        if (request.getStatus() != null) {
            post.setStatus(Post.PostStatus.valueOf(request.getStatus()));
        }

        Post updatedPost = postRepository.save(post);
        return mapToPostResponse(updatedPost, userId);
    }

    @Override
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        if (!post.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this post");
        }

        post.setDeletedAt(LocalDateTime.now());
        postRepository.save(post);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getPostsByUser(Long userId, Long currentUserId, Pageable pageable) {
        User targetUser = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Strict Privacy: Only allow viewing posts if:
        // 1. Viewing own posts
        // 2. Both users follow each other (Mutual Follow)
        if (!userId.equals(currentUserId)) {
            // Use repository query instead of lazy-loaded collections
            boolean areMutualFollowers = userRepository.areMutualFollowers(currentUserId, userId);

            if (!areMutualFollowers) {
                // Return empty page instead of throwing exception for better UX
                // Frontend will handle this gracefully
                log.info("User {} attempted to view posts of user {} without mutual follow", currentUserId, userId);
                return PageResponse.<PostResponse>builder()
                        .content(java.util.Collections.emptyList())
                        .page(0)
                        .size(pageable.getPageSize())
                        .totalElements(0L)
                        .totalPages(0)
                        .hasNext(false)
                        .hasPrevious(false)
                        .build();
            }
        }

        Page<Post> posts = postRepository.findByAuthorId(userId, pageable);
        return mapToPageResponse(posts, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PostResponse> searchPosts(String query, Pageable pageable, Long currentUserId) {
        Page<Post> posts = postRepository.searchPosts(query, currentUserId, pageable);
        return mapToPageResponse(posts, currentUserId);
    }

    @Override
    public void toggleLike(Long postId, Long userId) {
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        User user = userRepository.findByIdActive(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (likeRepository.existsByPostIdAndUserId(postId, userId)) {
            likeRepository.deleteByPostIdAndUserId(postId, userId);
        } else {
            Like like = Like.builder()
                    .post(post)
                    .user(user)
                    .build();
            likeRepository.save(like);
        }
    }

    private PostResponse mapToPostResponse(Post post, Long currentUserId) {
        Integer commentCount = commentRepository.countByPostId(post.getId());
        long likeCount = likeRepository.countByPostId(post.getId());
        boolean isLiked = false;

        if (currentUserId != null) {
            isLiked = likeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);
        }

        UserResponse authorResponse = UserResponse.builder()
                .id(post.getAuthor().getId())
                .username(post.getAuthor().getUsername())
                .email(post.getAuthor().getEmail())
                .avatar(post.getAuthor().getAvatar())
                .build();

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .status(post.getStatus().toString())
                .author(authorResponse)
                .commentCount(commentCount != null ? commentCount : 0)
                .likeCount(likeCount)
                .isLiked(isLiked)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private PageResponse<PostResponse> mapToPageResponse(Page<Post> page, Long currentUserId) {
        return PageResponse.<PostResponse>builder()
                .content(page.getContent().stream()
                        .map(post -> mapToPostResponse(post, currentUserId))
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
