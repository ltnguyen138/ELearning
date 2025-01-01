package com.example.elearningbackend.order;

import com.example.elearningbackend.order.track.OrderTrackReq;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public Page<OrderRes> getPageForAdmin(Pageable pageable, OrderQuery orderQuery){
        return orderService.getPageForAdmin(pageable, orderQuery);
    }

    @GetMapping("/customer")
    public Page<OrderRes> getPageForCustomer(Pageable pageable, OrderQuery orderQuery){
        return orderService.getPageForCustomer(pageable, orderQuery);
    }

    @GetMapping("/accountant")
    public Page<OrderRes> getPageForAccountant(Pageable pageable, OrderQuery orderQuery){
        return orderService.getPageForAccountant(pageable, orderQuery);
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public OrderRes getByIdForAdmin(@PathVariable long id){
        return orderService.getById(id);
    }

    @GetMapping("/customer/{id}")
    public OrderRes getByIdForCustomer(@PathVariable long id){
        return orderService.getByIdForCustomer(id);
    }

    @PostMapping
    public OrderRes create(@RequestBody OrderReq orderReq){
        return orderService.create(orderReq);
    }

    @PutMapping("/{orderId}/track")
    public OrderRes updateTrackOrder(@PathVariable long orderId, @RequestBody OrderTrackReq orderTrackReq){
        return orderService.updateTrackOrder(orderId, orderTrackReq);
    }

    @GetMapping("/check-pending")
    public ResponseEntity<String> getProcessingOrder(){
        Order order = orderService.getPendingOrder();
        if(order == null){
            return ResponseEntity.ok("NO");
        }
        return ResponseEntity.ok("YES");
    }

    @GetMapping("/check-duplicate-pending")
    public ResponseEntity<String> checkDuplicateProcessingOrder(@RequestParam String paymentId){
        boolean isDuplicate = orderService.checkDuplicatePendingOrder(paymentId);
        if(isDuplicate){
            return ResponseEntity.ok("YES");
        }
        return ResponseEntity.ok("NO");
    }

    @DeleteMapping("/delete-pending")
    public void deleteProcessingOrder(){
        orderService.deletePendingOrder();
    }

    @PostMapping("/refund")
    public OrderRes createRefundOrder(@RequestBody RefundReq refundReq) throws IOException, InterruptedException {
        return orderService.createRefundOrder(refundReq);
    }
}
