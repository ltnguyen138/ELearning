import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import { Chapter } from 'src/app/model/chapter';
import { LectureService } from 'src/app/service/lecture.service';
import {Lecture} from "../../model/lecture";
import { LectureQuery } from 'src/app/dtos/lecture/lecture.query';
import {ChapterReq} from "../../dtos/chapter/chapter.req";
import {ConfirmationService} from "primeng/api";
import {animate, style, transition, trigger } from '@angular/animations';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-instructor-chapter',
  templateUrl: './instructor-chapter.component.html',
  styleUrls: ['./instructor-chapter.component.css'],
    animations: [
        trigger('slideToggle', [
            transition(':enter', [
                style({ height: '0', opacity: 0 }),
                animate('300ms ease-out', style({ height: '*', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms ease-out', style({ height: '0', opacity: 0 }))
            ])
        ])
    ]
})
export class InstructorChapterComponent implements OnInit {

    @Input() chapter!: Chapter;
    @Input() index!: number;
    @Output() removeChapter = new EventEmitter<number>();
    @Output() newChapter = new EventEmitter<Chapter>();
    lectures: Lecture[] = [];
    lectureQuery = new LectureQuery();
    isOpenChapterForm: boolean = false;
    chapterForm !: FormGroup
    isShowListLecture: boolean = false;
    isLoaded: boolean = false;
    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private chapterService: ChapterService,
                private lectureService: LectureService,
                private confirmService: ConfirmationService) {

            this.chapterForm = this.fb.group({
                name: ['', [Validators.required]],
            });


    }

    ngOnInit(): void {

        if(this.chapter.id === null) {
            this.isOpenChapterForm = true;
        }
        this.chapterForm = this.fb.group({
            name: [this.chapter.name, [Validators.required]],
        });

        this.getLectures();
    }

    getLectures(): void {
        if(!this.chapter || this.chapter.id === null) return;
        this.lectureQuery.chapterId = this.chapter.id;
        this.lectureService.getManagerPage(this.lectureQuery).subscribe({
            next: data => {
                this.lectures = data.content;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }

    toggleChapterForm(): void {
        this.isOpenChapterForm = !this.isOpenChapterForm;
    }

    saveChapter(): void {
        if(this.chapterForm.invalid) {
            this.toastr.error('Lỗi: Tên chương không được để trống');
            return;
        }
        const data: ChapterReq = {
            ...this.chapterForm.value,
            courseId: this.chapter.course.id
        }
        if(this.chapter.id === null) {
            this.chapterService.createChapter(data).subscribe({
                next: data => {
                    this.chapter = data;
                    this.toastr.success('Tạo chương thành công');
                    this.isOpenChapterForm = false;
                    this.newChapter.emit(this.chapter);
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                }
            });
        } else {
            this.chapterService.updateChapter(data, this.chapter.id).subscribe({
                next: data => {
                    this.chapter = data;
                    this.toastr.success('Cập nhật chương thành công');
                    this.isOpenChapterForm = false;
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                }
            });
        }
    }

    onRemoveChapter() {
        if(this.chapter.id === null) {
            this.removeChapter.emit(0);
            return
        }
        this.removeChapter.emit(this.chapter.id);
    }

    deleteLecture(lectureId: number): void {
        if(lectureId === 0){
            this.lectures.pop();
            return;
        }
        this.lectures = this.lectures.filter(lecture => lecture.id !== lectureId);
    }

    addLecture(){

        const newLecture: Lecture = {
            id: null,
            name: null,
            chapter: this.chapter,
            activated: null,
            createdTime: null,
            updatedTime: null,
            videoUrl: null,
            preview: null,
            resourceUrl: null,
            approvalStatus: null,
            orderNumber: null,
            videoDuration: null
        };

        this.lectures.push(newLecture);
    }

    toggleDisplayListLecture(): void {
        this.isShowListLecture = !this.isShowListLecture;
    }

    drop(event: CdkDragDrop<any[]>) {
        if(event.previousIndex == event.currentIndex) {
            return;
        }
        this.isLoaded = true;
        this.lectureService.swapOrderNumber(this.chapter.id!, this.lectures[event.previousIndex].id!, this.lectures[event.currentIndex].id!).subscribe({
            next: data => {
                this.isLoaded = false;
                moveItemInArray(this.lectures, event.previousIndex, event.currentIndex);
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });

    }

    newLecture(lecture: Lecture): void {

        this.lectures[this.lectures.length - 1] = lecture;
    }
}
