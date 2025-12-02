package com.example.learning.util;

import com.example.learning.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationUtils {

    @Autowired
    private JwtProvider jwtProvider;

    public Long extractUserIdFromToken(String token) {
        String email = jwtProvider.getEmailFromToken(token);
        // In a real application, you would query the database to get the user ID from email
        // For now, this is a placeholder
        return 1L;
    }

    public Long extractUserIdFromAuthentication(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() != null) {
            String email = authentication.getName();
            // Query database for user ID based on email
            return 1L; // Placeholder
        }
        return null;
    }
}
