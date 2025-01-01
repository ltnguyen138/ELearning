package com.example.elearningbackend.course;

import com.example.elearningbackend.category.Category;
import com.example.elearningbackend.chapter.Chapter;
import com.example.elearningbackend.common.FullEntity;
import com.example.elearningbackend.discount.Discount;
import com.example.elearningbackend.review.Review;
import com.example.elearningbackend.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "courses")
@Data
public class Course extends FullEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String alias;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String skillLevel;

    @Column(nullable = false)
    private double price;


    @Column()
    private String image;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private User instructor;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Chapter> chapters = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Discount> discounts = new HashSet<>();

    private int purchasedCount;

    private double averageRating;

    private int ratingCount;

    @Column(name = "moderation_requested", nullable = false)
    private boolean moderationRequested = false;

    private String approvalStatus;
}
