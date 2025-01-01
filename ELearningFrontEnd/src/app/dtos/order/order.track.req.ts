export class OrderTrackReq{

    public status: string;
    public note: string;

    constructor(data: any) {

        this.status = data.status;
        this.note = data.note;
    }
}