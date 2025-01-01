import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {ToastrService} from "ngx-toastr";
import {NotificationService} from "../../service/notification.service";
import {Notification} from "../../model/notification";
import { NotificationQuery } from 'src/app/dtos/notification/notification.query';
import {environment} from "../../environment";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

    notifications: Notification[] = [];
    notificationQuery = new NotificationQuery();
    totalPages: number = 0;
    visiblePages: number[] = [];

    constructor(private route : ActivatedRoute,
                private router: Router,
                private authService: AuthService,
                private toastr: ToastrService,
                private notificationService: NotificationService) { }

    ngOnInit(): void {

        this.route.queryParamMap.subscribe( params => {
            this.notificationQuery.page = +params.get('page')! || this.notificationQuery.page;
            this.notificationQuery.sort = params.get('sort') || this.notificationQuery.sort;
            this.getNotifications();
        });
    }

    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => this.notificationQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }

    getNotifications() {
        this.notificationService.getPage(this.notificationQuery).subscribe({
            next: data => {
                this.notifications = data.content;
                this.totalPages = data.totalPages;
                this.visiblePages = this.generatePageArray();
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách thông báo");
            }
        });
    }

    updateUrlParams() {
        debugger;
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.notificationQuery.queryParams,
            }
        )
    }
    pageChange(page: number) {
        this.notificationQuery.page = page;
        this.updateUrlParams();
    }

    gotoLinkNotification(notification: Notification) {
        if(!notification.read) {
            this.notificationService.readNotification(notification.id).subscribe({
                next: () => {
                    this.notifications.forEach(noti => {
                        if(noti.id === notification.id) {
                            noti.read = true;
                        }
                    });

                }
            });
        }
        if(notification.roleNotification =='INSTRUCTOR') {
            this.router.navigate(['/instructor/courses/'+notification.course.id]).then(() => {
                window.location.reload();
            });
        }
        if(notification.roleNotification =='LEARNER') {
            this.router.navigate(['/courses/'+ notification.course.alias]).then(() => {
                window.location.reload();
            });
        }
    }

    readAll() {
        this.notificationService.readAll().subscribe({
            next: () => {
                this.getNotifications();
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể đọc tất cả thông báo");
            }
        });
    }

    protected readonly environment = environment;
}
