package com.example.elearningbackend.order;

import com.example.elearningbackend.chapter.QChapter;
import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.course.CourseRepository;
import com.example.elearningbackend.course.QCourse;
import com.example.elearningbackend.discount.Discount;
import com.example.elearningbackend.discount.DiscountRepository;
import com.example.elearningbackend.discount.DiscountType;
import com.example.elearningbackend.discount.QDiscount;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.history.approval.ApprovalStatus;
import com.example.elearningbackend.lecture.Lecture;
import com.example.elearningbackend.lecture.LectureRepository;
import com.example.elearningbackend.lecture.QLecture;
import com.example.elearningbackend.mail.MailService;
import com.example.elearningbackend.order.detail.CartItemReq;
import com.example.elearningbackend.order.detail.OrderDetail;
import com.example.elearningbackend.order.detail.OrderDetailRepository;
import com.example.elearningbackend.order.detail.OrderDetailRes;
import com.example.elearningbackend.order.track.OrderTrack;
import com.example.elearningbackend.order.track.OrderTrackReq;
import com.example.elearningbackend.paypal.PayoutPaypalReq;
import com.example.elearningbackend.paypal.PaypalService;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.user.UserRepository;
import com.example.elearningbackend.user.user_course.UserCourse;
import com.example.elearningbackend.user.user_course.UserCourseRepository;
import com.example.elearningbackend.util.AuthUtil;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final DiscountRepository discountRepository;
    private final UserCourseRepository userCourseRepository;
    private final LectureRepository lectureRepository;
    private final PaypalService paypalService;
    private final OrderDetailRepository orderDetailRepository;
    private final MailService mailService;
    private final EntityManager entityManager;

    @Override
    public Page<OrderRes> getPageForAdmin(Pageable pageable, OrderQuery orderQuery) {

        orderQuery.setAdmin(true);
        return orderRepository.findAll(orderQuery.toPredicate(), pageable).map(orderMapper::toOrderRes);
    }

    @Override
    public Page<OrderRes> getPageForCustomer(Pageable pageable, OrderQuery orderQuery) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        orderQuery.setAdmin(false);
        QOrder qOrder = QOrder.order;
        Predicate predicate = qOrder.user.id.eq(loggedInUser.getId()).and(orderQuery.toPredicate());

        return orderRepository.findAll(predicate, pageable).map(orderMapper::toOrderRes);
    }

    @Override
    public Page<OrderRes> getPageForAccountant(Pageable pageable, OrderQuery orderQuery) {
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        orderQuery.setAdmin(false);
        orderQuery.setUserId(loggedInUser.getId());
        return orderRepository.findAll(orderQuery.toPredicate(), pageable).map(orderMapper::toOrderRes);
    }

    @Override
    public OrderRes updatePaymentId(long orderId, String paymentId) {

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setPaymentId(paymentId);
        return orderMapper.toOrderRes(orderRepository.save(order));
    }

    @Override
    public OrderRes completeOrder(long orderId) throws MessagingException, IOException {

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        User user = userRepository.findById(order.getUser().getId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        order.setStatus(OrderStatus.COMPLETED.toString());
        OrderTrack orderTrack = OrderTrack.builder()
                .order(order)
                .status(OrderStatus.COMPLETED.toString())
                .note("Dơn hàng thanh toán thành công")
                .updateTime(LocalDateTime.now())
                .build();
        order.getOrderTracks().add(orderTrack);
        for(OrderDetail orderDetail : order.getOrderDetails()){

            Course course = orderDetail.getCourse();
            if(userCourseRepository.existsByUserIdAndCourseId(user.getId(), course.getId())){
                throw new ResourceNotFoundException("Course already purchased");
            }
            course.setPurchasedCount(course.getPurchasedCount() + 1);
            courseRepository.save(course);
            QLecture qLecture = QLecture.lecture;
//            Predicate predicate = qLecture.orderNumber.eq(0)
//                    .and(qLecture.chapter.orderNumber.eq(0))
//                    .and(qLecture.chapter.course.id.eq(course.getId()));
//            Lecture lecture = lectureRepository.findOne(predicate).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
            Long lectureId = getFirstLecture(course.getAlias());
            if(lectureId == null){
                throw new ResourceNotFoundException("Lecture not found");
            }
            UserCourse userCourse = UserCourse.builder()
                    .user(order.getUser())
                    .course(orderDetail.getCourse())
                    .currentLectureId(lectureId)
                    .build();
            user.getUserCourses().add(userCourse);
            mailService.sendEmailPurchaseSuccess(user.getEmail(), course.getName(), course.getAlias());
        }
        return orderMapper.toOrderRes(orderRepository.save(order));
    }

    @Override
    public OrderRes getByIdForCustomer(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        QOrder qOrder = QOrder.order;
        Predicate predicate = qOrder.user.id.eq(loggedInUser.getId())
                .and(qOrder.id.eq(id))
                .and(qOrder.isDeleted.isFalse());
        Order order = orderRepository.findOne(predicate).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return orderMapper.toOrderRes(order);
    }

    @Override
    public OrderRes getById(long id) {

        QOrder qOrder = QOrder.order;
        Predicate predicate = qOrder.id.eq(id).and(qOrder.isDeleted.isFalse());
        Order order = orderRepository.findOne(predicate).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return orderMapper.toOrderRes(order);
    }

    @Override
    @Transactional
    public OrderRes create(OrderReq orderReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();

        User user = userRepository.findById(loggedInUser.getId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Order order = orderMapper.toOrder(orderReq);
        order.setActivated(true);
        order.setUser(user);
        order.setPaymentId("");
        Set<OrderDetail> orderDetails = new HashSet<>();
        for(CartItemReq cartItemReq : orderReq.getCartItems()){
            OrderDetail orderDetail = buildOrderDetail(cartItemReq, order, user);
            orderDetails.add(orderDetail);
            order.setTotalAmount(order.getTotalAmount() + orderDetail.getPrice());
            order.setDiscountAmount(order.getDiscountAmount() + orderDetail.getDiscountPrice());
            order.setFinalAmount(order.getFinalAmount() + orderDetail.getFinalPrice());
            if(userCourseRepository.existsByUserIdAndCourseId(user.getId(), orderDetail.getCourse().getId())){
                throw new ResourceNotFoundException("Course already purchased");
            }

        }
        order.setOrderDetails(orderDetails);
        OrderTrack orderTrack = OrderTrack.builder()
                .order(order)
                .status(OrderStatus.PENDING.name())
                .note("Đơn hàng đã được tạo, đang chờ thực hiện thanh toán")
                .updateTime(LocalDateTime.now())
                .build();
        order.setOrderTracks(new HashSet<>(Set.of(orderTrack)));
        order.setStatus(OrderStatus.PENDING.name());

        userRepository.save(user);
        return orderMapper.toOrderRes(orderRepository.save(order));

    }

    private OrderDetail buildOrderDetail(CartItemReq cartItemReq, Order order, User user) {

        Course course = courseRepository.findById(cartItemReq.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        if(userCourseRepository.existsByUserIdAndCourseId(user.getId(), course.getId())){
            throw new ResourceNotFoundException("Course already purchased");
        }
        OrderDetail orderDetail = OrderDetail.builder()
                .order(order)
                .course(course)
                .price(course.getPrice())
                .discountPrice(0.0)
                .finalPrice(course.getPrice())
                .refunded(false)
                .build();
        if (cartItemReq.getDiscountCode() != null && !cartItemReq.getDiscountCode().isEmpty()) {
            QDiscount qDiscount = QDiscount.discount1;
            LocalDate now = LocalDate.now();
            Predicate predicate = qDiscount.code.eq(cartItemReq.getDiscountCode())
                    .and(qDiscount.isActivated.isTrue())
                    .and(qDiscount.isDeleted.isFalse())
                    .and(qDiscount.validTo.goe(now))
                    .and(qDiscount.validFrom.loe(now));

            Discount discount = discountRepository.findOne(predicate).orElseThrow(() -> new ResourceNotFoundException("Discount not found ff"));
            if (discount.getType().equals(DiscountType.COURSE.name()) && discount.getCourse().getId() != course.getId()) {
                throw new ResourceNotFoundException("Discount not found");
            }
            if(discount.getQuantity()!=null && discount.getQuantity() == 0){
                throw new ResourceNotFoundException("Discount is out of stock");
            }
            if (discount.getQuantity() != null){
                discount.setQuantity(discount.getQuantity() - 1);
                discountRepository.save(discount);
            }
            orderDetail.setDiscount(discount);
            orderDetail.setDiscountPrice(orderDetail.getPrice()*discount.getDiscount()/100);
            orderDetail.setFinalPrice(orderDetail.getPrice() - orderDetail.getDiscountPrice());
        }

        courseRepository.save(course);
        return orderDetail;
    }

    @Override
    public OrderRes update(long id, OrderReq orderReq) {
        return null;
    }

    @Override
    public void delete(long id) {

        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        orderRepository.delete(order);
    }

    @Transactional
    @Override
    public OrderRes updateTrackOrder(long orderId, OrderTrackReq orderTrackReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        User user = userRepository.findById(loggedInUser.getId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        OrderTrack orderTrack = OrderTrack.builder()
                .order(order)
                .status(orderTrackReq.getStatus())
                .note(orderTrackReq.getNote())
                .updateTime(LocalDateTime.now())
                .build();
        order.getOrderTracks().add(orderTrack);
        order.setStatus(orderTrackReq.getStatus());

        if (orderTrackReq.getStatus().equals(OrderStatus.CANCELLED.toString())) {
            for (OrderDetail orderDetail : order.getOrderDetails()) {
                Course course = orderDetail.getCourse();
                course.setPurchasedCount(course.getPurchasedCount() - 1);
                courseRepository.save(course);

                user.getUserCourses().removeIf(userCourse -> userCourse.getCourse().getId() == course.getId());
                userRepository.save(user);
            }
        }
        return orderMapper.toOrderRes(orderRepository.save(order));
    }

    @Override
    public OrderRes getByPaymentId(String paymentId) {

        QOrder qOrder = QOrder.order;
        Predicate predicate = qOrder.paymentId.eq(paymentId).and(qOrder.isDeleted.isFalse());
        Order order = orderRepository.findOne(predicate).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return orderMapper.toOrderRes(order);
    }

    @Override
    public boolean checkHasUserCourses(OrderRes orderRes) {

        for(OrderDetailRes orderDetailRes : orderRes.getOrderDetails()){
            if(userCourseRepository.existsByUserIdAndCourseId(orderRes.getUser().getId(), orderDetailRes.getCourse().getId())){
                return true;
            }
        }
        return false;
    }

    @Override
    public Order getPendingOrder() {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        return orderRepository.findByStatusAndUser_Id(OrderStatus.PENDING.name(), loggedInUser.getId()).orElse(null);

    }

    @Override
    public boolean checkDuplicatePendingOrder(String paymentId) {

        Order order = orderRepository.findByStatusAndPaymentIdIsNotLike(OrderStatus.PENDING.name(), paymentId).orElse(null);
        if(order != null){
            return true;
        }
        return false;
    }

    @Override
    public OrderRes updateProcessingStatus(long orderId) {

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(OrderStatus.PROCESSING.name());
        OrderTrack orderTrack = OrderTrack.builder()
                .order(order)
                .status(OrderStatus.PROCESSING.name())
                .note("Đơn hàng đang được xử lý")
                .updateTime(LocalDateTime.now())
                .build();
        order.getOrderTracks().add(orderTrack);
        return orderMapper.toOrderRes(orderRepository.save(order));
    }

    @Override
    public void deletePendingOrder() {

        Order order = getPendingOrder();
        if(order == null){
            return;
        }
        if(order.getStatus().equals(OrderStatus.PENDING.name())){
            orderRepository.delete(order);
        }

    }

    @Override
    @Transactional
    public OrderRes createRefundOrder(RefundReq refundReq) throws IOException, InterruptedException {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        QOrder qOrder = QOrder.order;
        Predicate predicate = qOrder.status.eq(OrderStatus.REFUNDED.name())
                .and(qOrder.createdTime.goe(LocalDateTime.now().minusDays(30)))
                .and(qOrder.user.id.eq(loggedInUser.getId()));
        long countRefundOrder = orderRepository.count(predicate);
        if(countRefundOrder >= 5){
            throw new ResourceNotFoundException("Bạn chỉ có thể yêu cầu hoàn tiền tối đa 5 lần trong 30 ngày");
        }

        OrderDetail orderDetailRefund = orderDetailRepository.findById(refundReq.getOrderDetailId()).orElseThrow(() -> new ResourceNotFoundException("Order detail not found"));
        if(orderDetailRefund.getRefunded()!=null && orderDetailRefund.getRefunded()){
            throw new ResourceNotFoundException("Bạn đã yêu cầu hoàn tiền cho khóa học này");
        }

        Course course = courseRepository.findById(refundReq.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Discount discount = discountRepository.findById(refundReq.getDiscountId()).orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
        Order order = Order.builder()
                .status(OrderStatus.REFUNDED.name())
                .totalAmount(refundReq.getTotalAmount())
                .discountAmount(refundReq.getDiscountAmount())
                .finalAmount(refundReq.getFinalAmount())
                .user(loggedInUser)
                .build();
        OrderDetail orderDetail = OrderDetail.builder()
                .order(order)
                .course(course)
                .price(refundReq.getTotalAmount())
                .discountPrice(0.0)
                .discountPrice(refundReq.getDiscountAmount())
                .finalPrice(refundReq.getFinalAmount())
                .build();
        if(discount != null){
            orderDetail.setDiscount(discount);
        }
        OrderTrack orderTrack = OrderTrack.builder()
                .order(order)
                .status(OrderStatus.REFUNDED.name())
                .note(refundReq.getReason())
                .updateTime(LocalDateTime.now())
                .build();


        order.setActivated(true);
        order.setOrderDetails(new HashSet<>(Set.of(orderDetail)));
        order.setOrderTracks(new HashSet<>(Set.of(orderTrack)));
        PayoutPaypalReq payoutPaypalReq = new PayoutPaypalReq();
        payoutPaypalReq.setEmail(loggedInUser.getEmail());
        payoutPaypalReq.setAmount(refundReq.getFinalAmount());
        String paymentId = paypalService.createPayout(payoutPaypalReq);
        order.setPaymentId(paymentId);

        orderDetailRefund.setRefunded(true);
        orderDetailRepository.save(orderDetailRefund);

        UserCourse userCourse = userCourseRepository.findByCourseAliasAndUserId(course.getAlias(), loggedInUser.getId());
        if(userCourse != null){
            userCourseRepository.delete(userCourse);
        }
        return orderMapper.toOrderRes(orderRepository.save(order));
    }

    public Long getFirstLecture(String alias) {

        QLecture qLecture = QLecture.lecture;
        QChapter qChapter = QChapter.chapter;
        QCourse qCourse = QCourse.course;

        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);
        Long lecture = queryFactory.select(qLecture.id)
                .from(qLecture)
                .innerJoin(qLecture.chapter, qChapter)
                .innerJoin(qChapter.course, qCourse)
                .where(
                        qCourse.alias.eq(alias),
                        qLecture.approvalStatus.eq(ApprovalStatus.APPROVED.name()),
                        qLecture.isDeleted.isFalse(),
                        qChapter.isDeleted.isFalse(),
                        qCourse.isDeleted.isFalse()

                )
                .orderBy(qChapter.orderNumber.asc(), qLecture.orderNumber.asc())
                .limit(1)
                .fetchOne();
        return lecture;
    }
}
