package com.example.elearningbackend.order.detail;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OrderDetailController {

    private final OrderDetailService orderDetailService;
}
