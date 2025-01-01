package com.example.elearningbackend.user.earning;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/earning")
public class EarningController {

    private final EarningService earningService;

    @GetMapping("/get-payout-history")
    public List<PayoutHistoryRes> getPayoutHistory() {

        return earningService.getPayoutHistory();
    }

    @GetMapping("/get-earning")
    public EarningRes getEarning() {

        return earningService.getEarning();
    }

    @GetMapping("/payout")
    public PayoutHistoryRes payout() throws IOException, InterruptedException {

        return earningService.createPayout();
    }
}
