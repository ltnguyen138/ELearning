import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Course} from "../../model/course";
import { NoteQuery } from 'src/app/dtos/note/note.query';
import { Note } from 'src/app/model/note';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../service/auth.service";
import {ConfirmationService} from "primeng/api";
import { NoteService } from 'src/app/service/note.service';
import {NoteReq} from "../../dtos/note/note.req";

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.css'],
    animations: [
        trigger('slideToggle', [
            transition(':enter', [
                style({height: '0', opacity: 0}),
                animate('300ms ease-out', style({height: '*', opacity: 1}))
            ]),
            transition(':leave', [
                animate('300ms ease-out', style({height: '0', opacity: 0}))
            ])
        ])
    ]
})
export class NoteComponent implements OnInit {

    lectureId?: number
    alias: string | null = null;
    totalPages: number = 0;
    noteQuery = new NoteQuery();
    notes: Note[] = [];
    keywords: string = '';
    lectureIdFilter: number = -1;
    totalNotes: number = 0;
    searchKey: string = '';
    noteForm !: FormGroup;
    isShowNoteForm: boolean = false;
    loggedUser = this.authService.getUserFromLocalStorage();
    duration: number = 0;
    seconds: number = 0;
    minutes: number = 0;
    courseUrl: string = '';
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private confirmService: ConfirmationService,
                private noteService: NoteService,
                private cdRef: ChangeDetectorRef) {


        this.noteForm = this.fb.group({
            title: ['', [Validators.required]]
        });

    }

    ngOnInit(): void {
        console.log('Note component init');
        this.route.firstChild?.params.subscribe(params => {
            this.lectureId = params['id'];
            if(this.lectureIdFilter != -1) {
                this.noteQuery.lectureId = this.lectureId || -1;
                this.lectureIdFilter = this.lectureId || -1;
            }
            console.log('lectureId: ', this.lectureId);
            if(this.alias) {
                this.getNotes();
            }

        });
        this.route.paramMap.subscribe(params => {
            this.alias = params.get('alias');
            this.noteQuery.courseAlias = this.alias || '';
            console.log('alias: ', this.alias);
        });
        this.noteService.updateDuration$.subscribe(duration => {
            this.duration = duration;
            this.convertDecimalToMinutesAndSeconds();
        });
        this.getNotes();
        this.courseUrl = this.router.createUrlTree(['./'], { relativeTo: this.route }).toString();
        console.log('Course URL:', this.courseUrl);
    }

    getNotes() {
        this.noteQuery.page = 1;
        this.noteService.getPage(this.noteQuery).subscribe({

            next: (res) => {

                this.totalPages = res.totalPages;
                this.totalNotes = res.totalElements;
                this.notes = res.content;

            },
            error: (err) => {
                this.toastr.error('Lỗi tải dữ liệu', 'Lỗi');
            }

        });
    }

    getMoreNotes() {
        this.noteQuery.page = this.noteQuery.page + 1;
        this.noteService.getPage(this.noteQuery).subscribe({
            next: (res) => {
                this.notes = this.notes.concat(res.content);
            },
            error: (err) => {
                this.toastr.error('Lỗi tải dữ liệu', 'Lỗi');
            }
        });
    }

    search() {

        this.noteQuery.page = 1;
        this.searchKey = this.keywords;
        this.noteQuery.title = this.searchKey;
        this.notes = [];
        this.getNotes();
    }

    changeLectureFilter() {
        this.noteQuery.page = 1;
        this.noteQuery.lectureId = this.lectureIdFilter;
        this.notes = [];
        this.getNotes();
    }

    clearFilter() {
        this.noteQuery.page = 1;
        this.noteQuery.lectureId = this.lectureId || -1;
        this.lectureIdFilter = this.lectureId || -1;
        this.noteQuery.title = '';
        this.notes = [];
        this.keywords = '';
        this.searchKey = '';
        this.getNotes();
    }

    createNote() {

        if (this.noteForm.invalid) {
            this.toastr.error('Vui lòng điền đầy đủ thông tin', 'Lỗi');
            return;
        }
        if (!this.lectureId || !this.alias) {
            this.toastr.error('Lỗi không thể tạo ghi chú', 'Lỗi');
            return;
        }
        const noteReq: NoteReq = {

            ...this.noteForm.value,
            duration: this.duration,
            lectureId: this.lectureId,
            courseAlias: this.alias
        }
        this.noteService.create(noteReq).subscribe({
            next: (res) => {
                this.toastr.success('Tạo ghi chú thành công', 'Thành công');
                this.notes = [];
                this.getNotes();
                this.noteForm.reset();
                this.isShowNoteForm = false;
            },
            error: (err) => {
                this.toastr.error('Lỗi tạo ghi chú', 'Lỗi');
            }

        });
    }

    delete(noteId: number) {
        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn xóa ghi chú này?',
            icon: "fa-solid fa-triangle-exclamation text-red-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            acceptButtonStyleClass: 'bg-delete-btn text-white hover:delete-btn-h',
            accept: () => {
                this.noteService.delete(noteId).subscribe({
                    next: (res) => {
                        this.notes = this.notes.filter(note => note.id !== noteId);
                        this.toastr.success('Xóa ghi chú thành công', 'Thành công');
                    },
                    error: (err) => {
                        this.toastr.error('Lỗi xóa ghi chú', 'Lỗi');
                    }
                });

            }

        });
    }

    convertDecimalToMinutesAndSeconds(){

        this.minutes = Math.floor(this.duration / 60);
        this.seconds = Math.floor(this.duration % 60);
    }

    formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60); // Tính phút
        const remainingSeconds = Math.floor(seconds % 60)   // Lấy phần dư để ra giây
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`; // Định dạng "phút:giây"
    }

    updateCurrentTime(duration: number, lectureId: number) {
        debugger;
        if(lectureId != this.lectureId) {
            this.router.navigate([this.courseUrl, lectureId],{ preserveFragment: true }).then(
                () => {
                    this.noteService.onUpdateCurrentLecture(duration);

                }
            )
            return;
        }
        this.noteService.onUpdateCurrentLecture(duration);
    }
}
