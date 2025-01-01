export interface ChatRoom{

    id: number;
    userId: number;
    adminId: number | null;
    active: boolean;
    startedAt: Date;
    adminRead: boolean;
    userRead: boolean;
}