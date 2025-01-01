package com.example.elearningbackend.category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface CategoryService {

    Page<CategoryRes> getManagerPage(Pageable pageable, CategoryQuery categoryQuery);

    Page<CategoryRes> getPublicPage(Pageable pageable, CategoryQuery categoryQuery);

    CategoryRes getManagerById(long id);

    CategoryRes getPublicByName(String name);

    CategoryRes getPublicByAlias(String alias);

    CategoryRes create(CategoryReq categoryReq);

    CategoryRes update(long id, CategoryReq categoryReq);

    void delete(long id);

    CategoryRes toggleActivation(long id);

    CategoryRes approveTemponary(long id);
}
