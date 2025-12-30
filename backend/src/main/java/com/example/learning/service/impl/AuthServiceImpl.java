package com.example.learning.service.impl;

import com.example.learning.dto.request.LoginRequest;
import com.example.learning.dto.request.RegisterRequest;
import com.example.learning.dto.response.AuthResponse;
import com.example.learning.dto.response.TokenResponse;
import com.example.learning.dto.response.UserResponse;
import com.example.learning.entity.User;
import com.example.learning.entity.UserRole;
import com.example.learning.exception.DuplicateEmailException;
import com.example.learning.exception.InvalidTokenException;
import com.example.learning.exception.UnauthorizedException;
import com.example.learning.repository.UserRepository;
import com.example.learning.security.JwtProvider;
import com.example.learning.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateEmailException("Username already taken");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role("USER")
                .build();

        // Create UserRole entity
        UserRole userRole = UserRole.builder()
                .user(user)
                .role("USER")
                .build();

        // Add role to user's roles set
        user.getRoles().add(userRole);

        User savedUser = userRepository.save(user);

        String token = jwtProvider.generateToken(savedUser.getEmail());
        String refreshToken = jwtProvider.generateRefreshToken(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .user(mapToUserResponse(savedUser))
                .expiresIn(jwtProvider.getExpirationTime())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtProvider.generateToken(user.getEmail());
        String refreshToken = jwtProvider.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .user(mapToUserResponse(user))
                .expiresIn(jwtProvider.getExpirationTime())
                .build();
    }

    @Override
    public TokenResponse refreshToken(String refreshToken) {
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        String email = jwtProvider.getEmailFromToken(refreshToken);
        String newToken = jwtProvider.generateToken(email);

        return TokenResponse.builder()
                .token(newToken)
                .expiresIn(jwtProvider.getExpirationTime())
                .build();
    }

    @Override
    public void logout(String token) {
        // You can implement token blacklist here if needed
        log.info("User logged out");
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UnauthorizedException("User not found"));
    }

    @Override
    public void saveUser(User user) {
        userRepository.save(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .status(user.getStatus().toString())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
