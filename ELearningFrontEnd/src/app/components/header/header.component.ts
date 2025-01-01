import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CategoryQuery } from 'src/app/dtos/category/category.query';
import { Category } from 'src/app/model/category';
import { UserService } from 'src/app/service/user.service';
import {User} from "../../model/user";
import { CategoryService } from 'src/app/service/category.service';
import {TokenService} from "../../service/token.service";
import { ToastrService } from 'ngx-toastr';
import {AuthService} from "../../service/auth.service";
import {environment} from "../../environment";
import {filter} from "rxjs";
import {NotificationService} from "../../service/notification.service";
import {Notification} from "../../model/notification";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

    keywork : string = '';
    categories: Category[] = [];
    categoryQuery = new CategoryQuery();
    totalPages: number=0;
    loggedUser?: User|null;
    fullName: string = '';
    isOpenMbMenu: boolean = false;
    isOpenMbSearch: boolean = false;
    isAdminDisplay: boolean = false;
    isInstructorDisplay: boolean = false;
    isLearnerDisplay: boolean = true;
    notifications: Notification[] = [];
    newNotification: boolean = false;
    profilePictureApi: string = environment.api + 'users/profile-picture/';
    profilePictureUrl: string = environment.api + 'users/profile-picture/'+ this.loggedUser?.profilePicture;

    constructor(protected route : ActivatedRoute,
                protected router: Router,
                private authService: AuthService,
                private categoryService: CategoryService,
                private tokenService: TokenService,
                private toastr: ToastrService,
                private notificationService: NotificationService) {
    }
    ngOnInit(): void {


        this.getCategories();
        this.getLoggedUser();

        if(this.loggedUser != null) {
            this.getTop4Notifications();
            this.notificationService.subscribeToNotifications(this.loggedUser.id);
            this.notificationService.notificationSubject.subscribe({
                next: (data: Notification) => {
                    console.log(data);
                    this.notifications.unshift(data);
                    this.newNotification = true;
                    if(this.notifications.length > 4) {
                        this.notifications.pop();
                    }
                    // this.toastr.info(data.title, 'Thông báo',{positionClass: 'toast--right'});
                    this.toastr.info(data.title, 'Thông báo');
                }
            });
        }

        this.authService.loggedInUserName$.subscribe({
            next: (data: string) => {
                this.fullName = data;
            }
        });
        this.authService.loggedUser$.subscribe({
            next: (data: User | null) => {
                this.loggedUser = data;
            }
        });
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd)  // Sử dụng RouterEvent và ép kiểu đúng cách
            )
            .subscribe((event: NavigationEnd) => {
                const url = event.urlAfterRedirects;  // Lấy URL hiện tại sau khi điều hướng
                if(url.includes('admin')) {
                    this.isAdminDisplay = true;
                    this.isInstructorDisplay = false;
                    this.isLearnerDisplay = false;
                } else if(url.includes('instructor')) {
                    this.isAdminDisplay = false;
                    this.isInstructorDisplay = true;
                    this.isLearnerDisplay = false;
                } else {
                    this.isAdminDisplay = false;
                    this.isInstructorDisplay = false;
                    this.isLearnerDisplay = true;
                }
            });
    }




    getCategories() {
        this.categoryQuery.size = 100;
        this.categoryService.getPublicPage(this.categoryQuery).subscribe({
            next: data => {
                this.categories = data.content;
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });
    }

    getLoggedUser() {
        this.loggedUser = this.authService.getUserFromLocalStorage();
        if(this.loggedUser != null) {
            this.authService.updateUserName(this.loggedUser.fullName);
            this.profilePictureUrl = this.profilePictureApi + this.loggedUser.profilePicture;
        }
        this.authService.updateLoggedUser(this.loggedUser);
    }

    logout() {
        this.authService.removeUserFromLocalStorage();
        this.tokenService.removeToken();
        this.authService.updateUserName("");
        this.authService.updateLoggedUser(null);
        this.toastr.warning('Đã đăng xuất', 'Thông báo');
        this.router.navigate(['/']);
    }
    toggleMbMenu() {
        this.isOpenMbMenu = !this.isOpenMbMenu;
    }
    toggleMbSearch() {
        this.isOpenMbSearch = !this.isOpenMbSearch;
    }

    search() {
        if(this.keywork) {
            this.router.navigate(['/courses'], {
                relativeTo: this.route,
                queryParams: {keyword: this.keywork, page: 1},
                queryParamsHandling: 'merge'
            });
        }
    }

    getTop4Notifications() {
        this.notificationService.getTop4UnreadNotifications().subscribe({
            next: data => {
                this.notifications = data;
                this.newNotification=true;
                if(this.notifications.length === 0) {
                    this.newNotification = false;
                }
                if(this.notifications.length < 4) {
                    this.notificationService.getTop4Notifications().subscribe({
                        next: data => {
                            data.forEach(notification => {
                                if(this.notifications.length < 4 && !this.notifications.find(noti => noti.id === notification.id)) {
                                    this.notifications.push(notification);
                                }
                            });
                        },
                        error: error => {
                            this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');

                        }
                    });
                }
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });

    }

    isNewNotification() {
        return this.notifications.filter(notification => !notification.read).length > 0;
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
                    this.newNotification = this.isNewNotification();
                }
            });
        }
        if(notification.roleNotification =='INSTRUCTOR') {
            this.router.navigate(['/instructor/courses/detail/'+notification.course.id]).then(() => {
                window.location.reload();
            });
        }
        if(notification.roleNotification =='LEARNER') {
            this.router.navigate(['/courses/'+ notification.course.alias]).then(() => {
                window.location.reload();
            });
        }
        if(notification.roleNotification =='INSTRUCTOR_QA') {
            this.router.navigate(['/instructor/courses/detail/'+notification.course.id + '/qa']).then(() => {
                window.location.reload();
            });
        }

    }

    navigateToCourse(alias: string) {
        this.router.navigate(['/courses/'],{
            queryParams: {alias: alias}
        });
    }
    protected readonly environment = environment;
}
