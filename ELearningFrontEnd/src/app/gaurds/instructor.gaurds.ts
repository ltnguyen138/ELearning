import {Injectable, inject} from "@angular/core";
import {TokenService} from "../service/token.service";
import {ToastrService} from "ngx-toastr";
import {CanActivateFn, Router} from "@angular/router";
import { AuthService } from "../service/auth.service";

@Injectable({
    providedIn: 'root'
})
export class InstructorGaurds {
    constructor(private tokenService: TokenService,
                private authService: AuthService,
                private toasts: ToastrService,
                private router: Router) {
    }
    canActivate(): boolean {

        const loggedUser = this.authService.getUserFromLocalStorage();
        const token = this.tokenService.getToken();
        if (!loggedUser || !token || this.tokenService.isTokenExpired(token)) {
            this.toasts.error('Vui lòng đăng nhập', 'Lỗi');
            this.router.navigate(['/login']);
            return false;
        }
        if(loggedUser.role.name == 'LEARNER') {
            this.toasts.error('Bạn không có quyền truy cập', 'Lỗi');
            this.router.navigate(['/home']);
            return false;
        }
        if((loggedUser.role.name == 'ADMIN' || loggedUser.role.name == 'ROOT')){
            this.toasts.error('Bạn không có quyền truy cập', 'Lỗi');
            this.router.navigate(['/admin/dashboard']);
            return false;
        }
        return true
    }
}
export const InstructorGuardFn: CanActivateFn = (route, state) => {

    return inject(InstructorGaurds).canActivate();
}