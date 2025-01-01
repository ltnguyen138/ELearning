package com.example.elearningbackend.paypal;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

public class PayPalAccessTokenHttpClient {


    private static  String clientId = "AfWPPLqH0zLrDWC4vNlOGYVJgveg16zwcZ_Ofp176jp5ob_uLEZKkkeudhVfxU8SQVwBopogQ9vBaO7H";

    private static String clientSecret = "EIrH8ODezHeoLdATN8Kwd_pbAlyDLoz_bX9xLdjCID4WIukoSeQEn3OjI-cA1KSsjo8PUpaKr1i-2rE2";
    private static final String PAYPAL_TOKEN_URL = "https://api-m.sandbox.paypal.com/v1/oauth2/token";

  public static String getAccessToken() throws InterruptedException, IOException {
        // Mã hóa Client ID và Secret theo Base64
      System.out.println(clientId);
        String encodedCredentials = Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());

        // Tạo HttpClient
        HttpClient client = HttpClient.newHttpClient();

        // Tạo HttpRequest
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(PAYPAL_TOKEN_URL))
                .header("Authorization", "Basic " + encodedCredentials)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString("grant_type=client_credentials"))
                .build();

        // Gửi yêu cầu và nhận phản hồi
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // Kiểm tra nếu phản hồi thành công
        if (response.statusCode() == 200) {
            // Trích xuất access_token từ phản hồi JSON
            return extractAccessToken(response.body());
        } else {
            throw new RuntimeException("Failed to get access token: " + response.body());
        }
    }
    private static String extractAccessToken(String jsonResponse)  throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        return jsonNode.get("access_token").asText();
    }
}
