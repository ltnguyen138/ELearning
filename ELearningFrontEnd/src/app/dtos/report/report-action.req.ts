export class ReportActionReq{

    public actionType: string;
    public entityType: string;
    public reason: string;
    public entityId: number;
    public ids: number[];

    constructor(data: any) {
        this.actionType = data.actionType;
        this.entityType = data.entityType;
        this.reason = data.reason;
        this.entityId = data.entityId;
        this.ids = data.ids;
    }
}