export class QuestionAnswerReq{

    content:string;
    lectureId:number;
    userId:number;
    questionId:number | null;

    constructor(data: any) {
        this.content = data.content;
        this.lectureId = data.lectureId;
        this.userId = data.userId;
        this.questionId = data.questionId;
    }
}