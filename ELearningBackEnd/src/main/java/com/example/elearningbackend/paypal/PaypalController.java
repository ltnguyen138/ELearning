package com.example.elearningbackend.paypal;

import com.example.elearningbackend.exception.BusinessException;
import com.example.elearningbackend.order.OrderReq;
import com.example.elearningbackend.order.OrderRes;
import com.example.elearningbackend.order.OrderService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/paypal")
public class PaypalController {

    private final PaypalService paypalService;
    private final OrderService orderService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/payment/create")
    public ResponseEntity<?> createPayment(@RequestBody OrderReq orderReq) throws MessagingException, IOException {
        OrderRes orderRes = orderService.create(orderReq);
//        orderService.completeOrder(orderRes.getId());
//        return ResponseEntity.ok("Payment approved");
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(orderRes.getUser().getId()), "/checkout", PaypalStatus.CREATED.name());
        try {

            Payment payment = paypalService.createPayment(orderRes.getFinalAmount());

            orderService.updatePaymentId(orderRes.getId(), payment.getId());
            for (Links links: payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    return ResponseEntity.ok(links.getHref());
                }
            }
        } catch (Exception e) {
            orderService.delete(orderRes.getId());
            simpMessagingTemplate.convertAndSendToUser(String.valueOf(orderRes.getUser().getId()), "/checkout", PaypalStatus.ERROR.name());
            throw new BusinessException("Có lỗi xảy ra khi tạo thanh toán, vui lòng thử lại");
        }
        orderService.delete(orderRes.getId());
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(orderRes.getUser().getId()), "/checkout", PaypalStatus.ERROR.name());
        throw new BusinessException("Có lỗi xảy ra khi tạo thanh toán, vui lòng thử lại");

    }

    @GetMapping("/payment/success")
    public ResponseEntity<?> paymentSuccess(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId
    ) {
        try {
            //Kiem tra hoa don da dc thanh toan chua
            OrderRes orderRes = orderService.getByPaymentId(paymentId);
            if(orderService.checkDuplicatePendingOrder(orderRes.getPaymentId())){
                simpMessagingTemplate.convertAndSendToUser(String.valueOf(orderRes.getUser().getId()), "/checkout", PaypalStatus.ERROR.name());
                orderService.delete(orderRes.getId());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Order is being processed");
            }
            orderService.updateProcessingStatus(orderRes.getId());
            //Thuc hien thanh toan
            Payment payment = paypalService.executePayment(paymentId, payerId);
            //Kiem tra trang thai thanh toan
            if (payment.getState().equals("approved")) {
                orderService.completeOrder(orderRes.getId());
                simpMessagingTemplate.convertAndSendToUser(String.valueOf(orderRes.getUser().getId()), "/checkout", PaypalStatus.APPROVED.name());
                return ResponseEntity.ok("Payment approved");
            }
        } catch (PayPalRESTException e) {
            OrderRes orderRes = orderService.getByPaymentId(paymentId);
            orderService.delete(orderRes.getId());
            simpMessagingTemplate.convertAndSendToUser(String.valueOf(orderRes.getUser().getId()), "/checkout", PaypalStatus.ERROR.name());
            throw new BusinessException("Có lỗi xảy ra khi tạo thanh toán, vui lòng thử lại");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        OrderRes orderRes = orderService.getByPaymentId(paymentId);
        orderService.delete(orderRes.getId());
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(orderRes.getUser().getId()), "/checkout", PaypalStatus.ERROR.name());
        throw new BusinessException("Có lỗi xảy ra khi tạo thanh toán, vui lòng thử lại");}

    @GetMapping("/payment/cancel")
    public ResponseEntity<?> paymentCancel() {

        return ResponseEntity.ok("Payment cancelled");
    }

    @PostMapping("/payout")
    public ResponseEntity<String> sendPayout(@RequestBody PayoutPaypalReq payoutPaypalReq) {
        try {
            String result = paypalService.createPayout(payoutPaypalReq);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
