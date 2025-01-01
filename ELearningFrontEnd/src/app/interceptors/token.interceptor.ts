import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { TokenService } from "../service/token.service";
import { Router } from "@angular/router";
import { UserService } from "../service/user.service";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService,
              private router: Router,
              private userService: UserService,
              private toastr: ToastrService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const requiresToken = req.headers.get('x-requires-token');
      if(requiresToken) {
          const token = this.tokenService.getToken();
          if(!token) {
              console.log(req.url);
              this.toastr.error('Vui lòng đăng nhập dể thực hiện chức năng này' );
              this.router.navigate(['/login']);
              return throwError(() => new Error(' redirecting to login.'));
          }
          req = req.clone({
              setHeaders: {
                  Authorization: `Bearer ${token}`
              },
              headers: req.headers.delete('x-requires-token')
          });
          return next.handle(req);
      }
        return next.handle(req);
  }
}