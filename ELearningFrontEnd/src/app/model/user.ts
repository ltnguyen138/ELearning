import {Role} from "./role";

export interface User{

    id: number,
    email: String,
    fullName: string,
    phoneNumber: string | null,
    address:  string | null,
    birthDate: Date | null,
    title: string | null,
    bio: string | null,
    profilePicture: string ,
    roleName: string,
    activated: boolean,
    createdTime: Date,
    updatedTime: Date,
    role: Role,
}