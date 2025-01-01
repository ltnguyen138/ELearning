package com.example.elearningbackend.user.earning;

import com.example.elearningbackend.exception.BusinessException;
import com.example.elearningbackend.paypal.PayoutPaypalReq;
import com.example.elearningbackend.paypal.PaypalService;
import com.example.elearningbackend.statistic.*;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EarningService {

    private final PayoutHistoryRepository payoutHistoryRepository;
    private final StatisticService statisticService;
    private final PaypalService paypalService;
    private final PayoutMapper payoutMapper;
    private final double fee = 0.2;

    public EarningRes getEarning() {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        LocalDate endDate = today.minusDays(5);
        PayoutHistory latestPayout = getLatestPayout(loggedInUser);
        if(latestPayout != null) {
            startDate = latestPayout.getPayoutDate().toLocalDate();
        } else {
            startDate = loggedInUser.getCreatedTime().toLocalDate();
        }
        List<StatisticRes> statistics = getStatistics(loggedInUser, startDate, endDate);
        double totalEarning = 0;
        double globalDiscount = 0;
        double courseDiscount = 0;

        for(StatisticRes statistic : statistics) {
            totalEarning += statistic.getTotalPrice();
            globalDiscount += statistic.getGlobalDiscount();
            courseDiscount += statistic.getCourseDiscount();
        }
        double feeAmount = Math.round(totalEarning * fee);
        double finalEarning = totalEarning - feeAmount - courseDiscount;

        EarningRes earningRes = EarningRes.builder()
                .endDate(endDate.format(formatter))
                .startDate(startDate.format(formatter))
                .statistics(statistics)
                .totalEarning(totalEarning)
                .globalDiscount(globalDiscount)
                .courseDiscount(courseDiscount)
                .finalEarning(finalEarning)
                .fee(feeAmount)
                .build();

        return earningRes;
    }

    public PayoutHistory getLatestPayout(User user) {
        return payoutHistoryRepository.findFirstByUserIdOrderByPayoutDateDesc(user.getId()).orElse(null);
    }

    public List<StatisticRes> getStatistics(User user, LocalDate startDate, LocalDate endDate) {

        StatisticReq statisticReq =
                StatisticReq.builder()
                    .timeLineType(TimeLineType.DAY)
                    .statisticType(StatisticType.COURSE)
                    .startDate(startDate.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))
                    .endDate(endDate.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))
                    .instructorId(user.getId())
                    .refunded(false)
                    .build();

        return statisticService.createStatisticOrderComplete(statisticReq);
    }

    public List<PayoutHistoryRes> getPayoutHistory() {

        User user = (User) AuthUtil.getCurrentUser();
        List<PayoutHistory> payoutHistories = payoutHistoryRepository.findAllByUserIdOrderByPayoutDateDesc(user.getId());
        return payoutHistories.stream().map(payoutMapper::toPayoutHistoryRes).toList();
    }

    @Transactional
    public PayoutHistoryRes createPayout() throws IOException, InterruptedException {

        User user = (User) AuthUtil.getCurrentUser();

        PayoutHistory latestPayout = getLatestPayout(user);
        if(latestPayout != null){
            if(LocalDate.now().minusDays(30).isBefore(latestPayout.getPayoutDate().toLocalDate())){
                throw new BusinessException("Bạn chỉ được thực hiện 1 lần thanh toán trong vòng 30 ngày");
            }
        }

        EarningRes earningRes = getEarning();
        if(earningRes.getFinalEarning() < 500000){
            throw new BusinessException("Số tiền thanh toán tối thiểu là 500.000 VND");
        }

        PayoutPaypalReq payoutPaypalReq = PayoutPaypalReq.builder()
                .amount(earningRes.getFinalEarning())
                .email(user.getEmail())
                .build();
        String payoutId = paypalService.createPayout(payoutPaypalReq);
        PayoutHistory payoutHistory = PayoutHistory.builder()
                .payoutId(payoutId)
                .amount(earningRes.getFinalEarning())
                .payoutDate(LocalDateTime.now())
                .fee(earningRes.getFee())
                .globalDiscount(earningRes.getGlobalDiscount())
                .courseDiscount(earningRes.getCourseDiscount())
                .totalEarning(earningRes.getTotalEarning())

                .user(user)
                .build();
        PayoutHistory savedPayout = payoutHistoryRepository.save(payoutHistory);

        return payoutMapper.toPayoutHistoryRes(savedPayout);
    }
}
