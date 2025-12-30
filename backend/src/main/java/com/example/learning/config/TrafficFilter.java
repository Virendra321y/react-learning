package com.example.learning.config;

import com.example.learning.service.AdminService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
                adminService.recordTraffic(ipAddress, uri);
            }
        }

        chain.doFilter(request, response);
    }
}
