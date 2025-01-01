export class DiscountReq{


    public code: string;
    public type: string;
    public discount: number;
    public validFrom: Date;
    public validTo: Date;
    public quantity: number;
    public courseId: number | null;
    public activated: boolean
    constructor(data: any) {

        this.code = data.code;
        this.type = data.type;
        this.discount = data.discount;
        this.validFrom = data.validFrom;
        this.validTo = data.validTo;
        this.quantity = data.quantity;
        this.courseId = data.courseId;
        this.activated = data.activated;
    }

}