package com.example.elearningbackend.discount;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/discounts")
public class DiscountController {

    private final DiscountService discountService;

    @GetMapping("/public")
    public Page<DiscountRes> getLearnedDiscounts(Pageable pageable, DiscountQuery discountQuery){
        return discountService.getPublicPage(pageable, discountQuery);
    }

    @GetMapping("/public/apply/{code}/{courseId}")
    public ApplyDiscountRes applyDiscount(@PathVariable String code, @PathVariable long courseId){
        return discountService.applyDiscount(code, courseId);
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public Page<DiscountRes> getDiscounts(Pageable pageable, DiscountQuery discountQuery){
        return discountService.getManagerPage(pageable, discountQuery);
    }

    @GetMapping("{id}")
    public DiscountRes getById(@PathVariable long id){
        return discountService.getManagerById(id);
    }

    @GetMapping("/public/global/can-use")
    public DiscountRes getGlobalCanUse(){
        return discountService.getGlobalCanUse();
    }

    @PostMapping("/global")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public DiscountRes createGlobal(@RequestBody DiscountReq discountReq){
        return discountService.createGlobal(discountReq);
    }

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public DiscountRes createForCourse(@PathVariable long courseId, @RequestBody DiscountReq discountReq){
        return discountService.createForCourse(courseId, discountReq);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public DiscountRes update(@PathVariable long id, @RequestBody DiscountReq discountReq){
        return discountService.update(id, discountReq);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public void delete(@PathVariable long id){
        discountService.delete(id);
    }

    @PutMapping("/{id}/toggle-activation")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public DiscountRes toggleActivation(@PathVariable long id){
        return discountService.toggleActivation(id);
    }
}
