import { Component, OnInit } from '@angular/core';
import { UserQuery } from 'src/app/dtos/user/user.query';
import { User } from 'src/app/model/user';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CategoryService} from "../../service/category.service";
import {ConfirmationService} from "primeng/api";
import {UserService} from "../../service/user.service";
import {RoleEnum} from "../../enum/role.enum";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrls: ['./manager-user.component.css']
})
export class ManagerUserComponent implements OnInit {
    loggedInUser: User
    users: User[] = [];
    userQuery = new UserQuery();
    totalPages: number = 0;
    visiblePages: number[] = [];
    keyword: string = '';
    activated?: boolean = true;
    role?: string = '';
    roleValues =  Object.entries(RoleEnum).map(([key, value]) => ({
        key,
        value
    }));

    constructor(protected router: Router,
                private toastr: ToastrService,
                protected route: ActivatedRoute,
                private userService: UserService,
                private confirmService: ConfirmationService,
                private authService: AuthService) {

        this.loggedInUser = this.authService.getUserFromLocalStorage()!;
    }

    ngOnInit(): void {

        this.route.queryParamMap.subscribe( params => {
            const activatedParam = params.get('activated');
            this.userQuery.page = +params.get('page')! || this.userQuery.page;
            this.userQuery.sort = params.get('sort') || this.userQuery.sort;
            this.userQuery.keyword = params.get('keyword') || undefined;
            this.userQuery.activated = params.get('activated') === 'true' || params.get('activated') === 'false'
                ? params.get('activated') === 'true'
                : undefined ,
            this.userQuery.role = params.get('role') || undefined;
            this.getUsers();
        });
    }

    getUsers() {
        this.userService.getPage(this.userQuery).subscribe({
            next: data => {
                this.users = data.content;
                this.totalPages = data.totalPages;
                this.visiblePages = this.generatePageArray();
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách người dùng");
            }
        });
    }

    generatePageArray(): number[] {

        return Array.from({ length: 9 }, (_, i) => this.userQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }

    deleteUser(userId: number) {

            this.confirmService.confirm({
                message: 'Bạn có chắc chắn muốn xóa người dùng này?',
                header: 'Xác nhận',
                icon: "fa-solid fa-triangle-exclamation text-yellow-500",
                acceptLabel: 'Xác nhận',
                rejectLabel: 'Quay lại',
                rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
                accept: () => {
                    this.userService.deleteUser(userId).subscribe({
                        next: data => {
                            this.toastr.success('Xóa người dùng thành công');
                            this.getUsers();
                        },
                        error: err => {
                            this.toastr.error('Lỗi: ' + "Không thể xóa người dùng");
                        }
                    });
                }
            });
    }

    toggleActivation(userId: number, index: number) {

        this.confirmService.confirm({
            message: 'Bạn có chắc chắn muốn thay đổi trạng thái người dùng này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.userService.toggleActivation(userId).subscribe({
                    next: data => {
                        this.toastr.success('Cập nhật trạng thái thành công');
                        this.updateUserAtIndex(index, data);
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + "Không thể cập nhật trạng thái người dùng");
                    }
                });
            }
        });

    }

    updateRoleAdmin(userId: number, userRole: string, index: number){

        this.confirmService.confirm({
            message: userRole == 'ADMIN' ? 'Bạn có chắc chắn muốn hủy quyền admin của người dùng này?' : 'Bạn có chắc chắn muốn cấp quyền admin cho người dùng này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.authService.updateRoleAdmin(userId).subscribe({
                    next: data => {
                        this.toastr.success('Cập nhật trạng thái thành công');
                        this.updateUserAtIndex(index, data);
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + "Không thể cập nhật trạng thái người dùng");
                    }
                });
            }
        });
    }

    updateUserAtIndex(index: number, data: User) {
        this.users[index] = data;
    }

    updateUrlParams() {
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.userQuery.queryParams,
            }
        )
    }
    pageChange(page: number) {
        this.userQuery.page = page;
        this.updateUrlParams();
    }

    search() {
        this.userQuery.keyword = this.keyword;
        this.updateUrlParams();
    }

    roleChange($event: Event) {
        this.userQuery.role = this.role
        this.userQuery.page = 1;
        this.updateUrlParams();
    }
    activatedChange($event: Event) {
        this.userQuery.activated = this.activated;
        this.userQuery.page = 1;
        this.updateUrlParams();
    }

    canDelete(user: User): boolean {
        if (user.role.name === RoleEnum.ROOT) {
            return false;
        }
        if(user.id === this.loggedInUser.id) {
            return false;
        }
        if(user.role.name === RoleEnum.ADMIN && this.loggedInUser.role.name !== RoleEnum.ROOT) {
            return false;
        }
        return true;
    }
}

