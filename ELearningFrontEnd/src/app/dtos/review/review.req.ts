export class ReviewReq{

    comment:string;
    rating:number;
    courseId:number;
    userId:number;

    constructor(data: any) {
        this.comment = data.comment;
        this.rating = data.rating;
        this.courseId = data.courseId;
        this.userId = data.userId
    }
}