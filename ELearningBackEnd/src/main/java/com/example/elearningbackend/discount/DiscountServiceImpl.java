package com.example.elearningbackend.discount;

import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.course.CourseMapper;
import com.example.elearningbackend.course.CourseRepository;
import com.example.elearningbackend.role.UserRole;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.user.UserRepository;
import com.example.elearningbackend.util.AuthUtil;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPAExpressions;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService{

    private final DiscountRepository discountRepository;
    private final DiscountMapper discountMapper;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;

    private final int MAX_DISCOUNT_PER_COURSE = 3;
    @Override
    public Page<DiscountRes> getPublicPage(Pageable pageable, DiscountQuery discountQuery) {

        discountQuery.setManager(false);
        return discountRepository.findAll(discountQuery.toPredicate(), pageable).map(discountMapper :: toDiscountRes);
    }

    @Override
    public Page<DiscountRes> getManagerPage(Pageable pageable, DiscountQuery discountQuery) {

        discountQuery.setManager(true);
        return discountRepository.findAll(discountQuery.toPredicate(), pageable).map(discountMapper :: toDiscountRes);
    }

    @Transactional
    @Override
    public DiscountRes createGlobal(DiscountReq discountReq) {

        if(discountRepository.existsByCodeAndIsDeletedIsFalse(discountReq.getCode())){
            throw new RuntimeException("Mã giảm giá đã tồn tại");
        }
        Discount discount = discountMapper.toDiscount(discountReq);
        discount.setType(DiscountType.GLOBAL.name());
        return discountMapper.toDiscountRes(discountRepository.save(discount));
    }

    @Transactional
    @Override
    public DiscountRes createForCourse(long courseId, DiscountReq discountReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();

        if(discountRepository.existsByCodeAndIsDeletedIsFalse(discountReq.getCode())){
            throw new RuntimeException("Mã giảm giá đã tồn tại");
        }
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(courseId).orElseThrow(() -> new RuntimeException("Khóa học không tồn tại"));
        if(course.getInstructor().getId() != loggedInUser.getId()){
            throw new RuntimeException("Bạn không có quyền tạo mã giảm giá cho khóa học này");
        }
        List<Discount> discounts = discountRepository.findAllByTypeAndCourseId(DiscountType.COURSE.name(), courseId);
        if(discounts.size() >= MAX_DISCOUNT_PER_COURSE){
            throw new RuntimeException("Bạn chỉ được tạo tối đa 3 mã giảm giá cho mỗi khóa học");
        }
        Discount discount = discountMapper.toDiscount(discountReq);
        discount.setType(DiscountType.COURSE.name());
        discount.setCourse(course);
        return discountMapper.toDiscountRes(discountRepository.save(discount));
    }

    @Transactional
    @Override
    public DiscountRes update(long id, DiscountReq discountReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();

        Discount discount = discountRepository.findById(id).orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

        if(discount.getType().equals(DiscountType.COURSE.name()) && discount.getCourse().getInstructor().getId() != loggedInUser.getId()){
            throw new RuntimeException("Bạn không có quyền cập nhật mã giảm giá này");
        }
        if(!discount.getType().equals(discountReq.getType())){
            throw new RuntimeException("Loại mã giảm giá không thể thay đổi");
        }
        if(!discount.getCode().equals(discountReq.getCode()) && discountRepository.existsByCodeAndIsDeletedIsFalse(discountReq.getCode())){
            throw new RuntimeException("Mã giảm giá đã tồn tại");
        }
        discountMapper.updateDiscount(discountReq, discount);
        return discountMapper.toDiscountRes(discountRepository.save(discount));
    }

    @Transactional
    @Override
    public void delete(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();

        Discount discount = discountRepository.findById(id).orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

        if(discount.getType().equals(DiscountType.COURSE.name()) && discount.getCourse().getInstructor().getId() != loggedInUser.getId()){
            throw new RuntimeException("Bạn không có quyền xóa mã giảm giá này");
        }
        discount.setDeleted(true);
        discountRepository.save(discount);
    }

    @Override
    public DiscountRes getManagerById(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        QDiscount qDiscount = QDiscount.discount1;
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        booleanBuilder.and(qDiscount.isDeleted.isFalse())
                .and(qDiscount.id.eq(id));
        if(loggedInUser.getRole().getName().equals(UserRole.INSTRUCTOR.name())){
            booleanBuilder.and(qDiscount.course.instructor.id.eq(loggedInUser.getId()));
        }
        return discountMapper.toDiscountRes(discountRepository.findOne(booleanBuilder.getValue()).orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại")));
    }

    @Transactional
    @Override
    public DiscountRes toggleActivation(long id) {

        Discount discount = discountRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));
        discount.setActivated(!discount.isActivated());
        return discountMapper.toDiscountRes(discountRepository.save(discount));
    }


    @Override
    public ApplyDiscountRes applyDiscount(String code, long courseId) {

        QDiscount qDiscount = QDiscount.discount1;
        Predicate predicate = qDiscount.isDeleted.isFalse()
                .and(qDiscount.code.eq(code))
                .and(qDiscount.isActivated.isTrue())
                .and(qDiscount.validFrom.loe(LocalDate.now()))
                .and(qDiscount.validTo.goe(LocalDate.now()));
        Discount discount = discountRepository.findOne(predicate).orElseThrow(() -> new RuntimeException("Không tìm thấy mã giảm giá"));
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(courseId).orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));
        if(discount.getType().equals(DiscountType.COURSE.name())){
            if(discount.getCourse().getId() != courseId){
                throw new RuntimeException("Không tìm thấy mã giảm giá");
            }
        }
        if(discount.getQuantity() == 0){
            throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng");
        }
        ApplyDiscountRes applyDiscountRes = ApplyDiscountRes.builder()
                        .course(courseMapper.toCourseShortRes(course))
                        .price(course.getPrice())
                        .discountPrice(course.getPrice() * discount.getDiscount() / 100)
                        .finalPrice(course.getPrice() - (course.getPrice() * discount.getDiscount() / 100))
                        .code(discount.getCode())
                        .build();

        return applyDiscountRes;
    }

    @Override
    public DiscountRes getGlobalCanUse() {

        QDiscount qDiscount = QDiscount.discount1;
        Predicate predicate = qDiscount.isDeleted.isFalse()
                .and(qDiscount.type.eq(DiscountType.GLOBAL.name()))
                .and(qDiscount.isActivated.isTrue())
                .and(qDiscount.validFrom.loe(LocalDate.now()))
                .and(qDiscount.validTo.goe(LocalDate.now()))
                .and(qDiscount.quantity.isNull());

        Iterable<Discount>  discountIterable =  discountRepository.findAll(predicate, Sort.by(Sort.Order.desc("discount")));

        List<Discount> discounts = StreamSupport.stream(discountIterable.spliterator(), false)
                .collect(Collectors.toList());

        if (discounts.isEmpty()) {
            return null;
        }

        Discount highestValueDiscount = discounts.get(0);

        return discountMapper.toDiscountRes(highestValueDiscount);
    }
}
