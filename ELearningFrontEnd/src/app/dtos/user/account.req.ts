export class AccountReq{
    fullName: string;
    email: string;
    phoneNumber: string | null;
    address:  string | null;
    birthDate: Date | null;
    title: string | null;
    bio: string | null;
    profilePicture: string | null;
    activated: boolean;

    constructor(data:any) {
        this.fullName = data.fullName;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        this.address = data.address;
        this.birthDate = data.birthDate;
        this.title = data.title;
        this.bio = data.bio;
        this.profilePicture = data.profilePicture;
        this.activated = true;
    }


}