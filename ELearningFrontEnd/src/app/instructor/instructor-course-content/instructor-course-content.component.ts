import { Component, OnInit } from '@angular/core';
import {Category} from "../../model/category";
import {Course} from "../../model/course";
import {Chapter} from "../../model/chapter";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {ChapterQuery} from "../../dtos/chapter/chapter.query";
import { ConfirmationService } from 'primeng/api';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import * as XLSX from 'xlsx';
import { ChapterReq } from 'src/app/dtos/chapter/chapter.req';
import { LectureReq } from 'src/app/dtos/lecture/lecture.req';

@Component({
  selector: 'app-instructor-course-content',
  templateUrl: './instructor-course-content.component.html',
  styleUrls: ['./instructor-course-content.component.css']
})
export class InstructorCourseContentComponent implements OnInit {

    chapters: Chapter[] = [];
    chapterQuery = new ChapterQuery();
    course!: Course;
    isLoaded: boolean = false;
    uploadExcel: ChapterReq[] = [];

    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private chapterService: ChapterService,
                private confirmService: ConfirmationService) {
    }
    ngOnInit(): void {

        this.route.parent?.paramMap.subscribe(paramMap => {
            if (paramMap.has('id')) {
                this.courseService.getInstructorCourse(+paramMap.get('id')!).subscribe({
                    next: data => {
                        this.course = data;
                        this.chapterQuery.courseId = this.course.id;
                        this.getChapters();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                        this.router.navigate(['/instructor/courses']);
                    }
                });
            }
        });
    }

    getChapters(): void {
        this.chapterService.getManagerPage(this.chapterQuery).subscribe({
            next: data => {
                this.chapters = data.content;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }

    addChapter(): void {
        if(this.chapters.length > 0 && this.chapters[this.chapters.length - 1].id === null) {
            this.toastr.warning('Vui lòng điền thông tin chương trước khi thêm mới');
            return;
        }
        const newChapter: Chapter = {
            id: null,
            name: null,
            course: this.course,
            activated: null,
            createdTime: null,
            updatedTime: null,
            orderNumber: null
        };

        this.chapters.push(newChapter);

    }

    deleteChapter(chapterId: number): void {

        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn xóa chương này?',
            icon: "fa-solid fa-triangle-exclamation bg-red-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            acceptButtonStyleClass: 'bg-delete-btn text-white hover:delete-btn-h',
            accept: () => {
                this.chapterService.deleteChapter(chapterId).subscribe({
                    next: data => {
                        this.chapters = this.chapters.filter(chapter => chapter.id !== chapterId);
                        this.toastr.success('Xóa chương thành công');
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });
    }

    onDeleteChapter(removeChapterId: number): void {
        console.log(removeChapterId);
        if( removeChapterId === 0) {
            this.chapters.pop();
            return;
        }
       this.deleteChapter(removeChapterId);
    }


    drop(event: CdkDragDrop<any[]>) {

        if(event.previousIndex == event.currentIndex) {
            return;
        }
        this.isLoaded = true;
        this.chapterService.swapOrderNumber(this.course.id!, this.chapters[event.previousIndex].id!, this.chapters[event.currentIndex].id!).subscribe({
            next: data => {
                this.isLoaded = false;
                moveItemInArray(this.chapters, event.previousIndex, event.currentIndex);
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });

    }

    newChapter(chapter: Chapter): void {

        this.chapters[this.chapters.length - 1] = chapter;
    }

    uploadExcelFile(event: any): void {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});

                // Chọn sheet đầu tiên
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Chuyển đổi sheet thành mảng JSON
                const jsonData: (string | undefined)[][] = XLSX.utils.sheet_to_json(worksheet, {header: 1});


                if(jsonData.length === 0) {
                    this.toastr.warning('File excel không có dữ liệu');
                    target.value = '';
                    return;
                }
                const chapters: ChapterReq[] = [];
                // Duyệt qua từng cột để tạo ChapterReq
                for (let colIndex = 0; colIndex < jsonData[0].length; colIndex++) {
                    const chapterName = jsonData[0][colIndex]; // Dòng đầu tiên là tên chapter
                    const lectures: LectureReq[] = [];

                    // Duyệt qua từng dòng bên dưới để lấy tên lecture
                    for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
                        const lectureName = jsonData[rowIndex][colIndex];
                        if (lectureName) { // Nếu tên lecture không rỗng
                            const lectureReq: LectureReq = {
                                name: lectureName,
                                chapterId: 1, // chapterId sẽ được cập nhật sau
                                preview: false,
                            }
                            lectures.push(lectureReq);
                        }
                    }
                    const chapterReq: ChapterReq = {
                        courseId: this.course.id!,
                        name: chapterName!,
                        lectures: lectures
                    }
                    chapters.push(chapterReq);
                }

                this.uploadExcel = chapters;};

            reader.readAsArrayBuffer(file);
            this.createChaptersAndLectures();
        }
        target.value = '';
    }

    createChaptersAndLectures(){
        console.log(this.uploadExcel);
        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn thêm chương và bài giảng từ file excel?',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            acceptButtonStyleClass: 'bg-active-btn text-white hover:bg-active-btn-h',
            accept: () => {
                this.chapterService.createChaptersAndLectures(this.uploadExcel).subscribe({
                    next: data => {
                        this.toastr.success('Thêm chương và bài giảng thành công');
                        this.getChapters();
                        this.uploadExcel = [];
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            },
            reject: () => {
                this.uploadExcel = [];
            }
        })
    }

    downloadTemplate(): void {
        this.chapterService.getFileCreateChaptersAndLecturesTemplate().subscribe((blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'template.xlsx'; // Tên file khi tải về
            a.click();

            // Hủy URL sau khi tải xong
            window.URL.revokeObjectURL(url);
        });
    }
}
