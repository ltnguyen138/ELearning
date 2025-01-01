package com.example.elearningbackend.util;

import com.example.elearningbackend.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@RequiredArgsConstructor
@Component
public class JwtTokenUtil {

    @Value("${jwt.expiration}")
    private long expiration;

    private final long resetPasswordExpiration = 1000 * 60 * 5; // 5 minutes

    private final long emailVerificationExpiration = 1000 * 60 * 60 * 24*3; // 3 days
    private final String secretKey = "8Zz5tw0Ionm3XPZZfN0NOml3z9NGOCHUYENfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb";


    public String generateOtherToken(User user, long expiration) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("userId", user.getId());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateEmailVerificationToken(User user) {

        return generateOtherToken(user, emailVerificationExpiration);
    }


    public String generateResetPasswordToken(User user) {

        return generateOtherToken(user, resetPasswordExpiration);
    }

    public String generateToken(User user) {

        Map<String, Object> claims =new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("userId", user.getId());
        claims.put("role", user.getRole().getName());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000L))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSigningKey() {
        byte[] bytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(bytes);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = this.extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> {
            Object userId = claims.get("userId");
            if (userId instanceof Integer) {
                return ((Integer) userId).longValue();  // Chuyển đổi từ Integer sang Long
            } else {
                return (Long) userId;  // Nếu đã là Long, trả về trực tiếp
            }
        });
    }

    public String extractType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }

    public boolean validateToken(String token, User user) {
        final String email = extractEmail(token);
        return (email.equals(user.getEmail()) && !isTokenExpired(token));
    }
}
