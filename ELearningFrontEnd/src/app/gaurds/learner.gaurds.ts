import { Injectable, inject } from "@angular/core";
import { TokenService } from "../service/token.service";
import {ToastrService} from "ngx-toastr";
import {CanActivateFn, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class LearnerGaurds{
    constructor(private tokenService: TokenService,
                private toasts: ToastrService,
                private router: Router) {
    }

    canActivate(): boolean{

        const token = this.tokenService.getToken();
        if (!token || this.tokenService.isTokenExpired(token)) {
            this.toasts.error('Vui lòng đăng nhập', 'Lỗi');
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
export const LearnerGuardFn: CanActivateFn = () => {
    return inject(LearnerGaurds).canActivate();
}

