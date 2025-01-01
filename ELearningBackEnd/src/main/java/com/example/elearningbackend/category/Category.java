package com.example.elearningbackend.category;

import com.example.elearningbackend.common.FullEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Category extends FullEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String alias;

    private Boolean temporary;
}
