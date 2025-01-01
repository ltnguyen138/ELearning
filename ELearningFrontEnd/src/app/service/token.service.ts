import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

    private readonly TOKEN_KEY = 'access_token';
    private jwtHelper = new JwtHelperService();
    constructor() { }

    public getToken(): string | null{
        return localStorage.getItem(this.TOKEN_KEY);
    }

    public setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    public removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    public getRoleFromToken(): string {

        const token = localStorage.getItem(this.TOKEN_KEY);
        if(token == null || !token) {
            return '';
        }
        const tokenPayload = this.jwtHelper.decodeToken(token);
        return 'role' in tokenPayload ? tokenPayload['role'] : '';
    }

    public isTokenExpired(token: string): boolean {

        if(token == null || !token) {
            return true;
        }
        return this.jwtHelper.isTokenExpired(token);
    }
}
