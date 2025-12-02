package com.example.learning.service;

import com.example.learning.dto.request.LoginRequest;
import com.example.learning.dto.request.RegisterRequest;
import com.example.learning.dto.response.AuthResponse;
import com.example.learning.dto.response.TokenResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    TokenResponse refreshToken(String refreshToken);
    void logout(String token);
}
