package com.example.elearningbackend.category;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public Page<CategoryRes> getPageForAdmin(Pageable pageable, CategoryQuery categoryQuery){
        return categoryService.getManagerPage(pageable, categoryQuery);
    }

    @GetMapping("/public")
    public Page<CategoryRes> getPageForCustomer(Pageable pageable, CategoryQuery categoryQuery){
        return categoryService.getPublicPage(pageable, categoryQuery);
    }

    @GetMapping("/public/{alias}")
    public CategoryRes getByAliasForCustomer(@PathVariable String alias){
        return categoryService.getPublicByAlias(alias);
    }

    @GetMapping("/manager/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public CategoryRes getById(@PathVariable long id){
        return categoryService.getManagerById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public CategoryRes create(@RequestBody CategoryReq categoryReq){
        return categoryService.create(categoryReq);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public CategoryRes update(@PathVariable long id, @RequestBody CategoryReq categoryReq){
        return categoryService.update(id, categoryReq);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public void delete(@PathVariable long id){
        categoryService.delete(id);
    }

    @PatchMapping("/toggle-activation/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public CategoryRes toggleActivation(@PathVariable long id){
        return categoryService.toggleActivation(id);
    }

    @PatchMapping("/approve-temporary/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public CategoryRes approveTemporary(@PathVariable long id){
        return categoryService.approveTemponary(id);
    }
}
