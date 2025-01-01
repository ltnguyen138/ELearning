 export class OrderReq{


    public  cartItems: {courseId: number, discountCode: string}[];

    constructor(data: any) {


        this.cartItems = data.cartItems;
    }
}