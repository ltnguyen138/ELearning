export class ApprovalReq{

    status: string;
    comment: string;

    constructor(data: any) {
        this.status = data.status;
        this.comment = data.comment;
    }
}