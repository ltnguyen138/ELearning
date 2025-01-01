package com.example.elearningbackend.user;

import com.example.elearningbackend.common.FullEntity;
import com.example.elearningbackend.role.Role;
import com.example.elearningbackend.user.user_course.UserCourse;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Table(name="users")
public class User extends FullEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String fullName;

    private String phoneNumber;

    private String password;

    private String address;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    private String headLine;

    private String bio;

    private String title;

    private String profilePicture;

    private Boolean isVerified;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="role_id")
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<UserCourse> userCourses;

    private LocalDateTime timeGeneratedResetPasswordToken;

    private LocalDateTime timeGeneratedVerificationToken;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_"+this.role.getName().toUpperCase()));
        return authorities;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.isActivated();
    }


}
