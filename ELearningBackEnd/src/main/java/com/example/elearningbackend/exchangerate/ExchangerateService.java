package com.example.elearningbackend.exchangerate;

import com.example.elearningbackend.util.ExchangeRateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ExchangerateService {

    private final ExchangerateRepository exchangerateRepository;

    public Exchangerate get() {

        Exchangerate exchangerate = exchangerateRepository.findFirstByDate(LocalDate.now()).orElse(null);
        if (exchangerate == null) {
            Exchangerate newExchangerate = new Exchangerate();
            Double value = ExchangeRateUtil.getUsdToVndRate();
            newExchangerate = new Exchangerate();
            newExchangerate.setValue(value);
            newExchangerate.setDate(LocalDate.now());
            return exchangerateRepository.save(newExchangerate);
        }
        return exchangerate;
    }
}
