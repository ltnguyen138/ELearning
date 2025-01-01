export class ReportReq{

    entityType: string;
    entityId: number;
    userId: number;
    reason: string;

    constructor(data: any) {
        this.entityType = data.entityType;
        this.entityId = data.entityId;
        this.userId = data.userId;
        this.reason = data.reason;
    }
}