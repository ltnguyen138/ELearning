import { Injectable } from '@angular/core';
import { environment } from '../environment';
import {HttpClient} from "@angular/common/http";
import {LoginRq} from "../dtos/user/login.rq";
import {RegisterRq} from "../dtos/user/register.rq";
import {HttpUtilsService} from "./http-utils.service";
import {AccountReq} from "../dtos/user/account.req";
import {User} from "../model/user";
import {BehaviorSubject, Observable} from "rxjs";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiAuth = environment.api + 'auth';
    private loggedInUserNameSubject = new BehaviorSubject<string>('');
    loggedInUserName$:Observable<string> = this.loggedInUserNameSubject.asObservable();
    private loggedUserSubject = new BehaviorSubject<User | null>(null);
    loggedUser$: Observable<User | null> = this.loggedUserSubject.asObservable();
    constructor(private http:HttpClient,
                private httpUtilsService: HttpUtilsService,
                ) { }

    login(loginReq: LoginRq): Observable<any> {
        return this.http.post(this.apiAuth + '/login', loginReq);
    }

    register(registerReq: RegisterRq): Observable<any> {
        return this.http.post(this.apiAuth + '/register', registerReq);
    }

    getLoggedUser(): Observable<User> {
        return this.http.get<User>(this.apiAuth + '/account', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    updateAccount(accountReq: AccountReq): Observable<User>{
        return this.http.put<User>(this.apiAuth + '/account', accountReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    changePassword(oldPassword: string, newPassword: string) {
        return this.http.put(this.apiAuth + '/account/change-password', {oldPassword, newPassword}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    saveUserToLocalStorage(user: User) {
        if(user == null || !user) {
            return;
        }
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUserFromLocalStorage(): User | null {

        const userJson = localStorage.getItem('user');
        if(userJson == null || !userJson) {
            return null;
        }
        return JSON.parse(userJson);
    }

    removeUserFromLocalStorage() {
        localStorage.removeItem('user');
    }


    updateUserName(fullName: string) {
        this.loggedInUserNameSubject.next(fullName);
    }

    updateLoggedUser(user: User | null) {
        this.loggedUserSubject.next(user);
    }

    loginWithGoogle(token: string): Observable<any> {

        return this.http.post(this.apiAuth + '/google', {token});
    }

    forgotPassword(email: string): Observable<any> {
        const httpOptions = {
            params: {"email": email},

        };
        return this.http.get(this.apiAuth + '/forgot-password', httpOptions);
    }

    validateResetPasswordToken(token: string, userId: number): Observable<any> {

        const httpOptions = {
            params: {"token": token, "userId": userId}
        }

        return this.http.get(this.apiAuth + '/validate-reset-password-token', httpOptions );
    }

    sendVerificationEmail(email: string): Observable<any> {

        const httpOptions = {
            params: {"email": email},

        };
        return this.http.get(this.apiAuth + '/send-verification-email', httpOptions);
    }

    validateEmailVerificationToken(token: string, userId: number): Observable<any> {

            const httpOptions = {
                params: {"token": token, "userId": userId}
            }

            return this.http.get(this.apiAuth + '/validate-email-verification-token', httpOptions );
    }

    resetPassword(token: string, password: string): Observable<any> {

        return this.http.post(this.apiAuth + '/reset-password', {token, password});
    }

    updateRoleInstruction(): Observable<User> {
        return  this.http.put<User>(this.apiAuth + '/update-role-instruction', {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    updateRoleAdmin(userId: number): Observable<User> {
        return  this.http.put<User>(this.apiAuth + '/update-role-admin/' + userId, {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
}
