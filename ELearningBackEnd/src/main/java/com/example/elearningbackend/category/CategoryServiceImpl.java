package com.example.elearningbackend.category;

import com.example.elearningbackend.exception.BusinessException;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.util.AppUtil;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public Page<CategoryRes> getManagerPage(Pageable pageable, CategoryQuery categoryQuery) {

        categoryQuery.setManager(true);
        return categoryRepository.findAll(categoryQuery.toPredicate(), pageable).map(categoryMapper::toCategoryRes);
    }

    @Cacheable(
            value = "publicCategories",
            key = "'page=' + #pageable.pageNumber + '-size=' + #pageable.pageSize + '-sort=' + #pageable.sort.toString() + '-query=' + #categoryQuery.toString()"
    )
    @Override
    public Page<CategoryRes> getPublicPage(Pageable pageable, CategoryQuery categoryQuery) {

        categoryQuery.setManager(false);
        return categoryRepository.findAll(categoryQuery.toPredicate(), pageable).map(categoryMapper::toCategoryRes);
    }



    @Override
    public CategoryRes getManagerById(long id) {

        return categoryRepository.findByIdAndIsDeletedIsFalse(id).map(categoryMapper::toCategoryRes).orElseThrow(() -> new ResourceNotFoundException("Chủ đề khóa học không tồn tại"));
    }

    @Override
    public CategoryRes getPublicByName(String name) {

        QCategory qCategory = QCategory.category;
        Predicate predicate = qCategory.name.eq(name).and(qCategory.isDeleted.isFalse()).and(qCategory.isActivated.isTrue());
            return categoryRepository.findOne(predicate).map(categoryMapper::toCategoryRes).orElseThrow(() -> new ResourceNotFoundException("Chủ đề khóa học không tồn tại"));
    }

    @Override
    public CategoryRes getPublicByAlias(String alias) {

        QCategory qCategory = QCategory.category;
        Predicate predicate = qCategory.alias.eq(alias).and(qCategory.isDeleted.isFalse()).and(qCategory.isActivated.isTrue());
        return categoryRepository.findOne(predicate).map(categoryMapper::toCategoryRes).orElseThrow(() -> new ResourceNotFoundException("Chủ đề khóa học không tồn tại"));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCategories", allEntries = true)
    public CategoryRes create(CategoryReq categoryReq) {

        if(categoryRepository.existsByNameAndIsDeletedIsFalse(categoryReq.getName())){
            throw new ResourceNotFoundException("Chủ đề khóa học đã tồn tại");
        }
        Category category = categoryMapper.toCategory(categoryReq);
        category.setAlias(AppUtil.toSlug(category.getName()));
        if (categoryRepository.existsByAlias(category.getAlias())) {
            throw new BusinessException("Chủ đề khóa học đã tồn tại");
        }
        category.setTemporary(false);
        return categoryMapper.toCategoryRes(categoryRepository.save(category));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCategories", allEntries = true)
    public CategoryRes update(long id, CategoryReq categoryReq) {

        Category category = categoryRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Chủ đề khóa học không tồn tại"));
        if(!category.getName().equals(categoryReq.getName())){
            if(categoryRepository.existsByNameAndIsDeletedIsFalse(categoryReq.getName())){
                throw new BusinessException("Chủ đề khóa học đã tồn tại");
            }

            String slug = AppUtil.toSlug(categoryReq.getName());

            if(categoryRepository.existsByAlias(slug)){
                throw new BusinessException("Chủ đề khóa học đã tồn tại");
            }

            category.setAlias(slug);
        }
        category.setTemporary(false);
        categoryMapper.updateCategory(categoryReq, category);
        return categoryMapper.toCategoryRes(categoryRepository.save(category));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCategories", allEntries = true)
    public void delete(long id) {

        Category category = categoryRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Chủ đề khóa học không tồn tại"));
        category.setDeleted(true);
        categoryRepository.save(category);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCategories", allEntries = true)
    public CategoryRes toggleActivation(long id) {

        Category category = categoryRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Chủ đề khóa học không tồn tại"));
        category.setActivated(!category.isActivated());
        return categoryMapper.toCategoryRes(categoryRepository.save(category));
    }

    @Override
    @CacheEvict(value = "publicCategories", allEntries = true)
    public CategoryRes approveTemponary(long id) {

        Category category = categoryRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Chủ đề khóa học không tồn tại"));
        category.setTemporary(false);
        category.setActivated(true);
        return categoryMapper.toCategoryRes(categoryRepository.save(category));
    }
}
