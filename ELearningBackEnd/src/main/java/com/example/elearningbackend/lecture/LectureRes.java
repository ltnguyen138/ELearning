package com.example.elearningbackend.lecture;

import com.example.elearningbackend.chapter.ChapterShortRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class LectureRes implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String name;

    private String videoUrl;

    private String resourceUrl;

    private boolean isDeleted;

    private boolean isActivated;

    private LocalDateTime createdTime;

    private LocalDateTime updatedTime;

    private boolean isPreview;

    private ChapterShortRes chapter;

    private String approvalStatus;

    private Integer orderNumber;

    private Float videoDuration;
}
