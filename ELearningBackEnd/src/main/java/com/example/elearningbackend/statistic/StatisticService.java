package com.example.elearningbackend.statistic;

import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.course.CourseRes;
import com.example.elearningbackend.course.QCourse;
import com.example.elearningbackend.discount.DiscountType;
import com.example.elearningbackend.history.approval.ApprovalStatus;
import com.example.elearningbackend.order.*;
import com.example.elearningbackend.order.detail.*;
import com.example.elearningbackend.user.QUser;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class StatisticService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderDetailMapper orderDetailMapper;
    private final OrderMapper orderMapper;
    private final EntityManager entityManager;

    private static LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
    private static LocalDateTime endOfToday = LocalDate.now().atTime(23, 59, 59);
    private static LocalDateTime startOfYesterday = LocalDate.now().minusDays(1).atStartOfDay();
    private static LocalDateTime endOfYesterday = LocalDate.now().minusDays(1).atTime(23, 59, 59);

    DateTimeFormatter formatterDay = DateTimeFormatter.ofPattern("dd-MM");
    DateTimeFormatter formatterMonth = DateTimeFormatter.ofPattern("MM-yyyy");
    DateTimeFormatter formatterYear = DateTimeFormatter.ofPattern("yyyy");

    List<OrderRes> getOrderComplete(StatisticReq statisticReq) {

        return StreamSupport.stream(orderRepository.findAll(statisticReq.toOrderPredicate()).spliterator(), false)
                .map(orderMapper::toOrderRes)
                .toList();

    }

    List<OrderDetailRes> getOrderDetailComplete(StatisticReq statisticReq) {

        return StreamSupport.stream(orderDetailRepository.findAll(statisticReq.toOrderDetailPredicate()).spliterator(), false)
                .map(orderDetailMapper::toOrderDetailRes)
                .toList();
    }

    List<OrderRes> getOrderRefunded(StatisticReq statisticReq) {
        statisticReq.setRefunded(true);
        return StreamSupport.stream(orderRepository.findAll(statisticReq.toOrderPredicate()).spliterator(), false)
                .map(orderMapper::toOrderRes)
                .toList();
    }

    List<OrderDetailRes> getOrderDetailRefunded(StatisticReq statisticReq) {
        statisticReq.setRefunded(true);
        return StreamSupport.stream(orderDetailRepository.findAll(statisticReq.toOrderDetailPredicate()).spliterator(), false)
                .map(orderDetailMapper::toOrderDetailRes)
                .toList();
    }

    public List<StatisticRes> createStatisticOrderComplete(StatisticReq statisticReq) {

        if(statisticReq.getStatisticType().equals(StatisticType.ORDER)){
            List<OrderRes> orders = getOrderComplete(statisticReq);
            List<StatisticRes> listStatisticRes = createStatisticDataTypeOrder(statisticReq);
            calculateStatisticTypeOrder(statisticReq, listStatisticRes, orders);
            return listStatisticRes;
        }else {
            List<OrderDetailRes> orderDetails = getOrderDetailComplete(statisticReq);
            List<StatisticRes> listStatisticRes = new ArrayList<>();
            calculateStatisticTypeProductOrCategory(statisticReq, listStatisticRes, orderDetails);
            return listStatisticRes;
        }
    }

    public List<StatisticRes> createStatisticOrderRefunded(StatisticReq statisticReq) {

        if(statisticReq.getStatisticType().equals(StatisticType.ORDER)){
            List<OrderRes> orders = getOrderRefunded(statisticReq);
            List<StatisticRes> listStatisticRes = createStatisticDataTypeOrder(statisticReq);
            calculateStatisticTypeOrder(statisticReq, listStatisticRes, orders);
            return listStatisticRes;
        }else {
            List<OrderDetailRes> orderDetails = getOrderDetailRefunded(statisticReq);
            List<StatisticRes> listStatisticRes = new ArrayList<>();
            calculateStatisticTypeProductOrCategory(statisticReq, listStatisticRes, orderDetails);
            return listStatisticRes;
        }
    }

    List<StatisticRes> createStatisticDataTypeOrder(StatisticReq statisticReq) {

        List<StatisticRes> listStatisticRes = new ArrayList<>();
        LocalDateTime startDateTime = statisticReq.buildStartDateTime();
        LocalDateTime endDateTime = statisticReq.buildEndDateTime();
        do{
            if(statisticReq.getTimeLineType().equals(TimeLineType.DAY)){
                StatisticRes statisticRes = StatisticRes.builder()
                        .identifier(startDateTime.format(formatterDay))
                        .totalPrice(0.0)
                        .finalPrice(0.0)
                        .globalDiscount(0.0)
                        .courseDiscount(0.0)
                        .countOrders(0.0)
                        .countCourse(0.0)
                        .countUsers(0.0)
                        .build();
                listStatisticRes.add(statisticRes);
                startDateTime = startDateTime.plusDays(1);
            }else if(statisticReq.getTimeLineType().equals(TimeLineType.MONTH)){
                StatisticRes statisticRes = StatisticRes.builder()
                        .identifier(startDateTime.format(formatterMonth))
                        .totalPrice(0.0)
                        .finalPrice(0.0)
                        .globalDiscount(0.0)
                        .courseDiscount(0.0)
                        .countOrders(0.0)
                        .countCourse(0.0)
                        .countUsers(0.0)
                        .build();
                listStatisticRes.add(statisticRes);
                startDateTime = startDateTime.plusMonths(1);
            }else {
                StatisticRes statisticRes = StatisticRes.builder()
                        .identifier(startDateTime.format(formatterYear))
                        .totalPrice(0.0)
                        .finalPrice(0.0)
                        .globalDiscount(0.0)
                        .courseDiscount(0.0)
                        .countOrders(0.0)
                        .countCourse(0.0)
                        .countUsers(0.0)
                        .build();
                listStatisticRes.add(statisticRes);
                startDateTime = startDateTime.plusYears(1);
            }

        }while (startDateTime.isBefore(endDateTime));
        return listStatisticRes;
    }

    void calculateStatisticTypeOrder(StatisticReq statisticReq, List<StatisticRes> listStatisticRes, List<OrderRes> orders) {

        for(OrderRes order : orders){

            String identifier = "";
            if(statisticReq.getTimeLineType().equals(TimeLineType.DAY)){
                identifier = order.getCreatedTime().substring(0,5);
            }else if(statisticReq.getTimeLineType().equals(TimeLineType.MONTH)){
                identifier = order.getCreatedTime().substring(3,10);
            }else {
                identifier = order.getCreatedTime().substring(6,10);
            }
            int index = listStatisticRes.indexOf(StatisticRes.builder().identifier(identifier).build());
            if(index == -1){
                continue;
            }
            StatisticRes statisticRes = listStatisticRes.get(index);
            statisticRes.setCountOrders(statisticRes.getCountOrders() + 1);
            Set<OrderDetailRes> orderDetails = order.getOrderDetails();
            for(OrderDetailRes orderDetail : orderDetails){
                if(statisticReq.getInstructorId()!=null && orderDetail.getCourse().getInstructor().getId() != statisticReq.getInstructorId()){
                    continue;
                }
                statisticRes.setTotalPrice(statisticRes.getTotalPrice() + orderDetail.getPrice());
                statisticRes.setFinalPrice(statisticRes.getFinalPrice() + orderDetail.getFinalPrice());
                if(orderDetail.getDiscount() == null){
                    continue;
                }
                if(orderDetail.getDiscount().getType().equals(DiscountType.GLOBAL.name())){
                    statisticRes.setGlobalDiscount(statisticRes.getGlobalDiscount() + orderDetail.getDiscountPrice());
                }else {
                    statisticRes.setCourseDiscount(statisticRes.getCourseDiscount() + orderDetail.getDiscountPrice());
                }
            }
        }
    }

    void calculateStatisticTypeProductOrCategory(StatisticReq statisticReq, List<StatisticRes> listStatisticRes, List<OrderDetailRes> orderDetails) {
        for(OrderDetailRes orderDetail : orderDetails){
            String identifier = "";
            if(statisticReq.getStatisticType().equals(StatisticType.CATEGORY)){
                identifier = orderDetail.getCourse().getCategory().getName();
            }else {
                identifier = orderDetail.getCourse().getName();
            }
            int index = listStatisticRes.indexOf(StatisticRes.builder().identifier(identifier).build());
            if(index == -1){
                StatisticRes statisticRes = StatisticRes.builder()
                        .identifier(identifier)
                        .totalPrice(orderDetail.getPrice())
                        .finalPrice(orderDetail.getFinalPrice())
                        .globalDiscount(0.0)
                        .courseDiscount(0.0)
                        .countOrders(0.0)
                        .countCourse(1.0)
                        .countUsers(0.0)
                        .build();
                if(orderDetail.getDiscount() == null){
                    listStatisticRes.add(statisticRes);
                    continue;
                }
                if(orderDetail.getDiscount().getType().equals(DiscountType.GLOBAL.name())){
                    statisticRes.setGlobalDiscount(statisticRes.getGlobalDiscount() + orderDetail.getDiscountPrice());
                }else {
                    statisticRes.setCourseDiscount(statisticRes.getCourseDiscount() + orderDetail.getDiscountPrice());
                }
                listStatisticRes.add(statisticRes);
            }else {
                StatisticRes statisticRes = listStatisticRes.get(index);
                statisticRes.setTotalPrice(statisticRes.getTotalPrice() + orderDetail.getPrice());
                statisticRes.setFinalPrice(statisticRes.getFinalPrice() + orderDetail.getFinalPrice());
                statisticRes.setCountCourse(statisticRes.getCountCourse() + 1);
                if(orderDetail.getDiscount() == null){
                    continue;
                }
                if(orderDetail.getDiscount().getType().equals(DiscountType.GLOBAL.name())){
                    statisticRes.setGlobalDiscount(statisticRes.getGlobalDiscount() + orderDetail.getDiscountPrice());
                }else {
                    statisticRes.setCourseDiscount(statisticRes.getCourseDiscount() + orderDetail.getDiscountPrice());
                }
            }
        }
    }

    public DashboardCartRes getRevenueCart(Long instructorId) {

        QOrderDetail qOrderDetail = QOrderDetail.orderDetail;
        QOrder qOrder = QOrder.order;
        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);

        BooleanBuilder todayQuery  = new BooleanBuilder();
        if(instructorId != null){
            todayQuery .and(qOrderDetail.course.instructor.id.eq(instructorId));
        }
        todayQuery .and(qOrderDetail.order.createdTime.between(startOfToday, endOfToday));

        BooleanBuilder yesterdayQuery  = new BooleanBuilder();
        if(instructorId != null){
            yesterdayQuery .and(qOrderDetail.course.instructor.id.eq(instructorId));
        }
        yesterdayQuery .and(qOrderDetail.order.createdTime.between(startOfYesterday, endOfYesterday));

        Double todayRevenue = queryFactory.select(qOrderDetail.finalPrice.sum())
                .from(qOrderDetail)
                .where(todayQuery)
                .fetchOne();

        Double yesterdayRevenue = queryFactory.select(qOrderDetail.finalPrice.sum())
                .from(qOrderDetail)
                .where(yesterdayQuery)
                .fetchOne();


        todayRevenue = (todayRevenue != null) ? todayRevenue : 0.0;
        yesterdayRevenue = (yesterdayRevenue != null) ? yesterdayRevenue : 0.0;

        double ratio = (yesterdayRevenue != 0) ?  ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) : todayRevenue;
        ratio = Math.round(ratio * 10000.0) / 10000.0;
        return DashboardCartRes.builder()
                .currentValue(todayRevenue)
                .previousValue(yesterdayRevenue)
                .ratio(ratio)
                .totalValue(0)
                .build();
    }

    public DashboardCartRes getCourseCart(Long instructorId) {

        QCourse qCourse = QCourse.course;
        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);

        BooleanBuilder todayQuery  = new BooleanBuilder();
        BooleanBuilder yesterdayQuery  = new BooleanBuilder();
        BooleanBuilder totalQuery  = new BooleanBuilder();

        totalQuery.and(qCourse.isDeleted.isFalse());
        yesterdayQuery.and(qCourse.isDeleted.isFalse());
        todayQuery.and(qCourse.isDeleted.isFalse());

        if(instructorId != null){
            todayQuery.and(qCourse.instructor.id.eq(instructorId));
            yesterdayQuery.and(qCourse.instructor.id.eq(instructorId));
            totalQuery.and(qCourse.instructor.id.eq(instructorId));
        }

        todayQuery.and(qCourse.createdTime.between(startOfToday, endOfToday));
        yesterdayQuery.and(qCourse.createdTime.between(startOfYesterday, endOfYesterday));
        totalQuery.and(qCourse.approvalStatus.eq(ApprovalStatus.APPROVED.name()));

        Double todayCourse = (double) queryFactory.select(qCourse)
                .from(qCourse)
                .where(todayQuery)
                .fetchCount();

        Double yesterdayCourse = (double) queryFactory.select(qCourse)
                .from(qCourse)
                .where(yesterdayQuery)
                .fetchCount();

        Double totalCourse = (double) queryFactory.select(qCourse)
                .from(qCourse)
                .where(totalQuery)
                .fetchCount();

        double ratio = (yesterdayCourse != 0) ?  ((todayCourse - yesterdayCourse) / yesterdayCourse) : todayCourse;
        ratio = Math.round(ratio * 10000.0) / 10000.0;
        return DashboardCartRes.builder()
                .currentValue(todayCourse)
                .previousValue(yesterdayCourse)
                .ratio(ratio)
                .totalValue(totalCourse)
                .build();

    }

    public DashboardCartRes getUserCart(){

        QUser qUser = QUser.user;
        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);

        BooleanBuilder todayQuery  = new BooleanBuilder();
        BooleanBuilder yesterdayQuery  = new BooleanBuilder();
        BooleanBuilder totalQuery  = new BooleanBuilder();

        totalQuery.and(qUser.isDeleted.isFalse());
        yesterdayQuery.and(qUser.isDeleted.isFalse());
        todayQuery.and(qUser.isDeleted.isFalse());

        todayQuery.and(qUser.createdTime.between(startOfToday, endOfToday));
        yesterdayQuery.and(qUser.createdTime.between(startOfYesterday, endOfYesterday));

        Double todayUser = (double) queryFactory.select(qUser)
                .from(qUser)
                .where(todayQuery)
                .fetchCount();

        Double yesterdayUser = (double) queryFactory.select(qUser)
                .from(qUser)
                .where(yesterdayQuery)
                .fetchCount();

        Double totalUser = (double) queryFactory.select(qUser)
                .from(qUser)
                .where(totalQuery)
                .fetchCount();

        double ratio = (yesterdayUser != 0) ?  ((todayUser - yesterdayUser) / yesterdayUser) : todayUser;
        ratio = Math.round(ratio * 10000.0) / 10000.0;
        return DashboardCartRes.builder()
                .currentValue(todayUser)
                .previousValue(yesterdayUser)
                .ratio(ratio)
                .totalValue(totalUser)
                .build();

    }

    public List<StatisticRes> getCategoryCourseStatistic(Long instructorId) {
        QCourse qCourse = QCourse.course;
        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);

        BooleanBuilder query = new BooleanBuilder();
        query.and(qCourse.isDeleted.isFalse());
        query.and(qCourse.approvalStatus.eq(ApprovalStatus.APPROVED.name()));
        if(instructorId != null){
            query.and(qCourse.instructor.id.eq(instructorId));
        }

        List<Course> courses = queryFactory.select(qCourse)
                .from(qCourse)
                .where(query)
                .fetch();

        if(courses.size() == 0){
            return null;
        }

        List<StatisticRes> listStatisticRes = new ArrayList<>();
        for(Course course : courses){
            int index = listStatisticRes.indexOf(StatisticRes.builder().identifier(course.getCategory().getName()).build());
            if(index == -1){
                StatisticRes statisticRes = StatisticRes.builder()
                        .identifier(course.getCategory().getName())
                        .totalPrice(course.getPrice())
                        .finalPrice(0.0)
                        .globalDiscount(0.0)
                        .courseDiscount(0.0)
                        .countOrders(0.0)
                        .countCourse(1.0)
                        .countUsers(0.0)
                        .build();
                listStatisticRes.add(statisticRes);
            }else {
                StatisticRes statisticRes = listStatisticRes.get(index);
                statisticRes.setCountCourse(statisticRes.getCountCourse() + 1);
            }
        }
        return listStatisticRes;
    }
}
