package com.example.learning.config;

import com.example.learning.service.AdminService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.learning.entity.User;
import com.example.learning.security.CustomUserDetails;

import java.io.IOException;

@Component
public class TrafficFilter implements Filter {

    @Autowired
    private AdminService adminService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (request instanceof HttpServletRequest) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            String uri = httpRequest.getRequestURI();

            // Only record API requests and ignore static resources/internal calls
            if (uri.startsWith("/api/v1") && !uri.contains("/admin/stats")) {
                String ipAddress = httpRequest.getHeader("X-Forwarded-For");
                if (ipAddress == null) {
                    ipAddress = httpRequest.getRemoteAddr();
                }
                String userAgent = httpRequest.getHeader("User-Agent");
                Long userId = null;

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated() &&
                        !"anonymousUser".equals(authentication.getPrincipal())) {
                    Object principal = authentication.getPrincipal();
                    if (principal instanceof CustomUserDetails) {
                        userId = ((CustomUserDetails) principal).getId();
                    }
                }

                adminService.recordTraffic(ipAddress, uri, userAgent, userId);
            }
        }

        chain.doFilter(request, response);
    }
}
