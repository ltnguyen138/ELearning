package com.example.elearningbackend.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public abstract class FullEntity extends AuditableEntity{

    @Column
    private boolean isActivated;

    @Column
    private boolean isDeleted;

    @Override
    public void prePersist() {
        super.prePersist();
        isDeleted = false;
    }

}
