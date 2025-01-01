export class RefundReq{

    public courseId: number;
    public discountId: number| null;
    public reason: string;
    public totalAmount: number;
    public discountAmount: number;
    public finalAmount: number;
    public orderDetailId: number;
    constructor(data: any) {

        this.courseId = data.courseId;
        this.discountId = data.discountId;
        this.reason = data.reason;
        this.totalAmount = data.totalAmount;
        this.discountAmount = data.discountAmount;
        this.finalAmount = data.finalAmount;
        this.orderDetailId = data.orderDetailId;
    }
}