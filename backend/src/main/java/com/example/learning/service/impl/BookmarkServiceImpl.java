package com.example.learning.service.impl;

import com.example.learning.dto.response.PageResponse;
import com.example.learning.dto.response.PostResponse;
import com.example.learning.dto.response.UserResponse;
import com.example.learning.entity.Bookmark;
import com.example.learning.entity.Post;
import com.example.learning.entity.User;
import com.example.learning.exception.ResourceNotFoundException;
import com.example.learning.repository.BookmarkRepository;
import com.example.learning.repository.PostRepository;
import com.example.learning.repository.UserRepository;
import com.example.learning.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void bookmarkPost(Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (bookmarkRepository.existsByUserAndPost(user, post)) {
            return; // Already bookmarked
        }

        Bookmark bookmark = Bookmark.builder()
                .user(user)
                .post(post)
                .build();

        bookmarkRepository.save(bookmark);
    }

    @Override
    @Transactional
    public void unbookmarkPost(Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Bookmark bookmark = bookmarkRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found"));

        bookmarkRepository.delete(bookmark);
    }

    @Override
    public PageResponse<PostResponse> getBookmarkedPosts(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<Bookmark> bookmarkPage = bookmarkRepository.findByUserOrderByCreatedAtDesc(user, pageable);

        List<PostResponse> content = bookmarkPage.getContent().stream()
                .map(bookmark -> mapToPostResponse(bookmark.getPost()))
                .collect(Collectors.toList());

        return PageResponse.<PostResponse>builder()
                .content(content)
                .page(bookmarkPage.getNumber())
                .size(bookmarkPage.getSize())
                .totalElements(bookmarkPage.getTotalElements())
                .totalPages(bookmarkPage.getTotalPages())
                .hasNext(bookmarkPage.hasNext())
                .hasPrevious(bookmarkPage.hasPrevious())
                .build();
    }

    @Override
    public boolean isBookmarked(Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findByIdActive(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        return bookmarkRepository.existsByUserAndPost(user, post);
    }

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .status(post.getStatus().name())
                .author(mapToUserResponse(post.getAuthor()))
                .commentCount(post.getComments().size())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .build();
    }
}
