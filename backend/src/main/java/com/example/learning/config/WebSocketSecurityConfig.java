package com.example.learning.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

/**
 * WebSocket Security Configuration
 * Configures security for WebSocket message broker
 */
@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
                // Allow anyone to connect to the WebSocket endpoint
                .nullDestMatcher().permitAll()
                // Allow anyone to subscribe to the error queue
                .simpSubscribeDestMatchers("/user/queue/errors").permitAll()
                // Require authentication for all other messages
                .anyMessage().authenticated();
    }

    @Override
    protected boolean sameOriginDisabled() {
        // Disable CSRF for WebSocket connections as we are using JWT
        return true;
    }
}
