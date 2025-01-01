export class RegisterRq{
    fullName: string;
    email: string;
    password: string;

    constructor(data:any) {
        this.fullName = data.fullName;
        this.email = data.email;
        this.password = data.password;
    }
}