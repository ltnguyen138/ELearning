import {User} from "./user";

export interface ActionHistory{

    id: number;
    type: string;
    entityName: string;
    entityId: number;
    admin: User;
    timestamp: Date;
}