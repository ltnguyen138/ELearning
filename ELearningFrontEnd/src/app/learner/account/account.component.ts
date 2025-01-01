import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import {environment} from "../../environment";
import {UserService} from "../../service/user.service";
import {AccountReq} from "../../dtos/user/account.req";
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit{

    loggedUser?: User | null;
    accountForm!: FormGroup;
    changePasswordForm!: FormGroup;
    profilePicture: File | null = null;
    profilePictureApi: string = environment.api + 'users/profile-picture/';
    profilePictureUrl: string = environment.api + 'users/profile-picture/'+ this.loggedUser?.profilePicture;
    isUpdateProfile: boolean = false;
    isUpdateAccount: boolean = false;
    isOpenChangePassword: boolean = false;
    isShowPassword: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private tokenService: TokenService) {
        this.accountForm = this.fb.group({
            fullName: [''],
            email: [''],
            phoneNumber: [''],
            address: [''],
            birthDate: [''],
            title: [''],
            bio: [''],
            createdTime: [''],
            updatedTime: ['']
        });
        this.changePasswordForm = this.fb.group({
            oldPassword: [''],
            newPassword: [''],
            confirmPassword: ['']
        });

    }
    ngOnInit(): void {

        this.getLoggedUser();
    }

    getLoggedUser() {
        this.authService.getLoggedUser().subscribe({
            next: data => {
                this.loggedUser = data;
                this.initializeAccountForm();
                // this.getProfilePictureUrl(this.loggedUser?.profilePicture!);
                this.profilePictureUrl = this.profilePictureApi + this.loggedUser?.profilePicture;
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });
    }

    initializeAccountForm() {
        this.accountForm = this.fb.group({
            fullName: [this.loggedUser?.fullName, Validators.required],
            email: [{value: this.loggedUser?.email, disabled: true}],
            phoneNumber: [this.loggedUser?.phoneNumber],
            address: [this.loggedUser?.address],
            birthDate: [this.loggedUser?.birthDate],
            title: [this.loggedUser?.title],
            bio: [this.loggedUser?.bio],
            createdTime: [{value: this.loggedUser?.createdTime, disabled: true}],
            updatedTime: [{value: this.loggedUser?.updatedTime, disabled: true}]
        });
    }

    onUploadImg($event: Event) {

        const file = ($event.target as HTMLInputElement).files![0];
        if(file && this.isImageFile(file)){
            this.profilePicture = file;
            this.profilePictureUrl = URL.createObjectURL(this.profilePicture);
            this.isUpdateProfile = true;
        }else {
            this.toastr.error('Vui lòng chọn file hình ảnh');
            ($event.target as HTMLInputElement).value = '';
        }

    }
    isImageFile(file: File): boolean {
        // Kiểm tra loại tệp
        const fileType = file.type;
        // Kiểm tra phần mở rộng của tệp
        const validExtensions = ['image/jpeg', 'image/png', 'image/gif']; // Các loại phần mở rộng hình ảnh hỗ trợ
        return validExtensions.includes(fileType);
    }


    saveProfilePicture() {
        if(this.profilePicture) {
            this.userService.uploadProfilePicture(this.profilePicture, this.loggedUser!.id).subscribe({
                next: data => {
                    this.toastr.success('Cập nhật ảnh đại diện thành công');
                    this.profilePictureUrl = this.profilePictureApi + data.profilePicture;
                    // this.getProfilePictureUrl(data?.profilePicture!);
                    this.isUpdateProfile = false;
                    this.authService.updateLoggedUser(data);
                    this.authService.saveUserToLocalStorage(data);
                },
                error: error => {
                    this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
                }
            });
        }
    }

    updateProfile() {
        if(this.accountForm.invalid) {
            this.toastr.error('Thông tin không hợp lệ', 'Lỗi');
            return;
        }

        if(this.accountForm.get('birthDate')?.value) {
            this.accountForm.get('birthDate')?.setValue(this.convertDate(this.accountForm.get('birthDate')?.value));
        }
        const accountReq:AccountReq = {
            ...this.accountForm.value
        }



        this.authService.updateAccount(accountReq).subscribe({
            next: data => {
                this.toastr.success('Cập nhật tài khoản thành công');
                this.loggedUser = data;
                this.initializeAccountForm();
                this.authService.updateLoggedUser(data);
                this.authService.saveUserToLocalStorage(data);

            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });

    }

    changePassword() {
        if(this.changePasswordForm.invalid) {
            this.toastr.error('Thông tin không hợp lệ', 'Đổi mật khẩu thất bại');
            return;
        }
        if(this.changePasswordForm.value.newPassword !== this.changePasswordForm.value.confirmPassword) {
            this.toastr.error('Nhập lại mật khẩu không chính xác', 'Đổi mật khẩu thất bại');
            return;
        }
        this.authService.changePassword(this.changePasswordForm.value.oldPassword, this.changePasswordForm.value.newPassword).subscribe({
            next: () => {
                this.toastr.success( 'Vui lòng đăng nhập lại','Đổi mật khẩu thành công');
                this.changePasswordForm.reset();
                this.isOpenChangePassword = false;
                this.authService.removeUserFromLocalStorage();
                this.tokenService.removeToken();
                this.authService.updateUserName("");
                this.authService.updateLoggedUser(null);
                this.router.navigate(['/login']);
            },
            error: error => {
                this.toastr.error(error.error.message, 'Đổi mật khẩu thất bại');
            }
        });
    }

    convertDate(date: string): string {
        console.log(date);
        let newDate = new Date(date);
        console.log(newDate);
        console.log(newDate.getTime());
        if (isNaN(newDate.getTime())) {
            console.log('Invalid date');
            return date;
        }
        const shortDateFormat = /^\d{2}-\d{2}-\d{4}$/;
        if(shortDateFormat.test(date)) {
            return date;
        }
        const day = ('0' + newDate.getDate()).slice(-2);   // Lấy ngày và thêm '0' nếu cần
        const month = ('0' + (newDate.getMonth() + 1)).slice(-2);  // Lấy tháng (tháng bắt đầu từ 0, nên cần cộng 1)
        const year = newDate.getFullYear();
        return `${day}-${month}-${year}`;


    }

    getProfilePictureUrl(profilePicture: string)  {

        this.userService.getProfilePictureUrl(profilePicture).subscribe({
            next: data => {
                let url = data.replace("https: //", "https://");
                this.profilePictureUrl = url;
            },
            error: error => {
                console.error('API Error:', error);
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau dscds', 'Lỗi');
            }
        });
    }

    updateRoleInstruction() {

        if(this.hasNullOrEmptyProperty(this.loggedUser!)) {
            this.toastr.error('Vui lòng cập nhật thông tin cá nhân trước khi thực hiện thao tác này');
            return;
        }
        this.authService.updateRoleInstruction().subscribe({
            next: data => {
                this.toastr.success('Cập nhật tài khoản thành công');
                this.loggedUser = data;
                this.authService.updateLoggedUser(data);
                this.authService.saveUserToLocalStorage(data);
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
        }});
    }

    hasNullOrEmptyProperty(user: User): boolean {
        for (let key in user) {
            debugger
            const value = user[key as keyof User];

            if (value === null || value === '') {
                return true; // Có ít nhất một thuộc tính là null hoặc ''
            }
        }

        return false; // Không có thuộc tính nào null hoặc ''
    }
    protected readonly environment = environment;
}
