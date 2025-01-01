package com.example.elearningbackend.discount;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public interface DiscountService {

    Page<DiscountRes> getPublicPage(Pageable pageable, DiscountQuery discountQuery);

    Page<DiscountRes> getManagerPage(Pageable pageable, DiscountQuery discountQuery);

    DiscountRes createGlobal(DiscountReq discountReq);

    DiscountRes createForCourse(long courseId, DiscountReq discountReq);

    DiscountRes update(long id, DiscountReq discountReq);

    void delete(long id);

    DiscountRes getManagerById(long id);

    DiscountRes toggleActivation(long id);

    ApplyDiscountRes applyDiscount(String code, long courseId);

    DiscountRes getGlobalCanUse();
}
