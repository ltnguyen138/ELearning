package com.example.elearningbackend.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class ExchangeRateUtil {

    private static final String API_URL = "https://v6.exchangerate-api.com/v6/44ff5e19f0a30b2fc8cea84b/latest/USD";

    public static Double getUsdToVndRate() {
        Double usdToVnd = null;
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet request = new HttpGet(API_URL);
            HttpResponse response = httpClient.execute(request);
            String jsonResponse = EntityUtils.toString(response.getEntity());

            // Parse JSON response
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(jsonResponse);

            // Lấy tỷ giá USD/VND từ JSON
            usdToVnd = root.path("conversion_rates").path("VND").asDouble();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return usdToVnd;
    }
}
