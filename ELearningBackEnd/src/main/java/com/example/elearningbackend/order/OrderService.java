package com.example.elearningbackend.order;

import com.example.elearningbackend.order.track.OrderTrackReq;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public interface OrderService {

    Page<OrderRes> getPageForAdmin(Pageable pageable, OrderQuery orderQuery);

    Page<OrderRes> getPageForCustomer(Pageable pageable, OrderQuery orderQuery);

    Page<OrderRes> getPageForAccountant(Pageable pageable, OrderQuery orderQuery);

    OrderRes updatePaymentId(long orderId, String paymentId);

    OrderRes completeOrder(long orderId) throws MessagingException, IOException;

    OrderRes getByIdForCustomer(long id);

    OrderRes getById(long id);

    OrderRes create(OrderReq orderReq);

    OrderRes update(long id, OrderReq orderReq);

    void delete(long id);

    OrderRes updateTrackOrder(long orderId, OrderTrackReq orderTrackReq);

    OrderRes getByPaymentId(String paymentId);

    boolean checkHasUserCourses(OrderRes orderRes);

    Order getPendingOrder();

    boolean checkDuplicatePendingOrder(String paymentId);

    OrderRes updateProcessingStatus(long orderId);

    void deletePendingOrder();

    OrderRes createRefundOrder(RefundReq refundReq) throws IOException, InterruptedException;
}
