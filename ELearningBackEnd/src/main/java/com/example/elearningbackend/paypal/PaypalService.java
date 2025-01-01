package com.example.elearningbackend.paypal;

import com.example.elearningbackend.order.OrderReq;
import com.example.elearningbackend.order.OrderRes;
import com.example.elearningbackend.order.OrderService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class PaypalService {

    private final APIContext apiContext;

    private static final String PAYPAL_PAYOUT_URL = "https://api-m.sandbox.paypal.com/v1/payments/payouts";
    private static final String cancelUrl = "http://localhost:4200";
    private static final String successUrl = "http://localhost:4200/checkout-success";
    private static final String intent = "sale";
    private static final String method = "paypal";
    private static final String currency = "USD";

    private static final Double exchangeRate = 25000D;
    public Payment createPayment(
            Double total
    ) throws PayPalRESTException {


        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(String.format("%.2f", total/exchangeRate)); // 9.99$ - 9,99€

        Transaction transaction = new Transaction();
        transaction.setDescription("Thanh toán khóa học tại ELearning");
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        Payment payment = new Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);

        payment.setRedirectUrls(redirectUrls);

        return payment.create(apiContext);
    }

    public Payment executePayment(
            String paymentId,
            String payerId
    ) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentId);

        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);

        return payment.execute(apiContext, paymentExecution);
    }

    public String createPayout(PayoutPaypalReq payoutPaypalReq) throws IOException, InterruptedException {
        System.out.println("Access token: ");
        String accessToken = PayPalAccessTokenHttpClient.getAccessToken();

        System.out.println(accessToken);
        HttpClient httpClient = HttpClient.newHttpClient();
        String amount = String.format("%.2f", payoutPaypalReq.getAmount()/exchangeRate);
        String senderBatchId = "batch_" + System.currentTimeMillis();
        String payoutJson = String.format("{\"sender_batch_header\": {\"sender_batch_id\": \"%s\", \"email_subject\": \"You have a payout!\"}," +
                        "\"items\": [{\"recipient_type\": \"EMAIL\",\"amount\": {\"value\": \"%s\",\"currency\": \"%s\"}," +
                        "\"receiver\": \"%s\",\"note\": \"Thanks for using our service!\"}]}",
                senderBatchId, amount, currency, payoutPaypalReq.getEmail());

        HttpRequest payoutRequest = HttpRequest.newBuilder()
                .uri(URI.create(PAYPAL_PAYOUT_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + accessToken)
                .POST(HttpRequest.BodyPublishers.ofString(payoutJson))
                .build();

        HttpResponse<String> payoutResponse = httpClient.send(payoutRequest, HttpResponse.BodyHandlers.ofString());

        if (payoutResponse.statusCode() == 201) {
            String responseBody = payoutResponse.body();
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            return jsonNode.get("batch_header").get("payout_batch_id").asText();
        } else {
            throw new RuntimeException("Failed to create payout: " + payoutResponse.body());
        }
    }

}
