package com.example.elearningbackend.statistic;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/statistic")
public class StatisticController {

    private final StatisticService statisticService;

    @GetMapping("/get-statistic-complete-order")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public List<StatisticRes> getStatisticCompleteOrder(StatisticReq statisticReq) {
        return statisticService.createStatisticOrderComplete(statisticReq);
    }

    @GetMapping("/get-statistic-refunded-order")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public List<StatisticRes> getStatisticRefundOrder(StatisticReq statisticReq) {
        return statisticService.createStatisticOrderRefunded(statisticReq);
    }

    @GetMapping("/get-revenue-cart")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public DashboardCartRes getRevenueCart(@RequestParam(required = false, name = "instructorId") Long instructorId) {
        return statisticService.getRevenueCart(instructorId);
    }

    @GetMapping("/get-course-cart")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public DashboardCartRes getCourseCart(@RequestParam(required = false, name = "instructorId") Long instructorId) {
        return statisticService.getCourseCart(instructorId);
    }

    @GetMapping("/get-user-cart")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public DashboardCartRes getUserCart() {
        return statisticService.getUserCart();
    }

    @GetMapping("/get-category-course-statistic")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public List<StatisticRes> getCategoryCourseStatistic(@RequestParam(required = false, name = "instructorId") Long instructorId) {
        return statisticService.getCategoryCourseStatistic(instructorId);
    }
}
