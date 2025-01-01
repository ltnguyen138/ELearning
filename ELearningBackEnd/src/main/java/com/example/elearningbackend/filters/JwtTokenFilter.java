package com.example.elearningbackend.filters;

import com.example.elearningbackend.exception.AuthenticationException;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.util.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if (isPypassToken(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7);
            String email = jwtTokenUtil.extractEmail(jwtToken);
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                User userDetails = (User) userDetailsService.loadUserByUsername(email);
                if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(token);
                }else {
                    throw new AuthenticationException("Token is invalid");
                }
            }
            filterChain.doFilter(request, response);
        }else {
            System.out.println(request.getRequestURI());
            System.out.println(request.getMethod());
            throw new AuthenticationException("Token is required"+request.getRequestURI());
        }
    }

    private boolean isPypassToken(HttpServletRequest request) {
        final List<Pair<String, String>> pypassTokents = Arrays.asList(
                Pair.of("/api/v1/auth/register", "POST"),
                Pair.of("/api/v1/auth/login", "POST"),
                Pair.of("/api/v1/auth/forgot-password", "GET"),
                Pair.of("/api/v1/auth/send-verification-email", "GET"),
                Pair.of("/api/v1/auth/validate-email-verification-token", "GET"),
                Pair.of("/api/v1/auth/validate-reset-password-token", "GET"),
                Pair.of("/api/v1/auth/reset-password", "POST"),
                Pair.of("/api/v1/users/reset-password", "POST"),
                Pair.of("/api/v1/users/reset-password", "GET"),
                Pair.of("/api/v1/users/refresh-token", "POST"),
                Pair.of("/api/v1/users/profile-picture", "GET"),
                Pair.of("/api/v1/users/profile-picture-url", "GET"),
                Pair.of("/api/v1/users/public", "GET"),
                Pair.of("/api/v1/roles", "POST"),
                Pair.of("/api/v1/categories/public", "GET"),
                Pair.of("/api/v1/chapters/public", "GET"),
                Pair.of("/api/v1/courses/public", "GET"),
                Pair.of("/api/v1/courses/image", "GET"),
                Pair.of("/api/v1/discounts/public", "GET"),
                Pair.of("/api/v1/lectures/public", "GET"),
//                Pair.of("/api/v1/lectures/enrolled", "GET"),
                Pair.of("/api/v1/lectures/manager/document", "GET"),
                Pair.of("/api/v1/lectures/manager/video", "GET"),
                Pair.of("/api/v1/reviews/public", "GET"),
                Pair.of("/api/v1/auth/google", "POST"),
                Pair.of("/api/v1/mail", "GET"),
                Pair.of("/ws", "GET"),
                Pair.of("/api/v1/vnpay", "GET"),
                Pair.of("/api/v1/paypal", "GET"),

                Pair.of("/favicon", "GET")

        );
        for (Pair<String, String> pypassToken : pypassTokents) {

            if (request.getRequestURI().startsWith(pypassToken.getFirst()) && request.getMethod().equals(pypassToken.getSecond())) {
                System.out.println(request.getRequestURI());
                return true;
            }
        }
        return false;
    }
}
