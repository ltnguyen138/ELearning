package com.example.elearningbackend.filters;

import com.example.elearningbackend.util.JwtTokenUtil;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.List;
import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenUtil jwtTokenUtil;

    public JwtHandshakeInterceptor(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {

        // Lấy token từ header hoặc query parameter
        List<String> authorization = request.getHeaders().get("Authorization");
        String jwtToken = null;

        if (authorization != null && !authorization.isEmpty()) {
            // Lấy token từ header Authorization
            jwtToken = authorization.get(0).substring(7); // Bỏ qua "Bearer "
        } else {
            // Nếu không có trong header thì lấy từ query parameter
            String query = request.getURI().getQuery();
            if (query != null && query.contains("token=")) {
                jwtToken = query.substring(query.indexOf("token=") + 6);
            }
        }

        if (jwtToken != null && jwtTokenUtil.isTokenExpired(jwtToken)) {
            String email = jwtTokenUtil.extractEmail(jwtToken);
            if (email != null) {
                // Thêm thông tin người dùng vào attributes để sử dụng trong các frame sau này
                attributes.put("userEmail", email);
                return true;
            }
        }

        return false; // Từ chối kết nối nếu token không hợp lệ
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        // Không cần xử lý sau handshake
    }
}
