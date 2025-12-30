package com.example.learning.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * AuthChannelInterceptor
 * Intercepts WebSocket messages to authenticate user via JWT token in STOMP
 * headers
 */
@Component
@Slf4j
public class AuthChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String bearerToken = accessor.getFirstNativeHeader("Authorization");
            log.debug("WebSocket Connect attempt with token presence: {}", StringUtils.hasText(bearerToken));

            if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                String jwt = bearerToken.substring(7);
                try {
                    if (tokenProvider.validateToken(jwt)) {
                        String email = tokenProvider.getEmailFromToken(jwt);
                        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                        // Set the user in the accessor so it's available in controllers
                        accessor.setUser(authentication);

                        // Also set in SecurityContext for this thread (though STOMP might use different
                        // threads)
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        log.info("WebSocket connection authenticated for user: {}", email);
                    }
                } catch (Exception e) {
                    log.error("Could not authenticate WebSocket connection", e);
                }
            }
        }
        return message;
    }
}
