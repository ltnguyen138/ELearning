export class NoteReq{

    title:string;
    duration:number;
    courseAlias:string;
    lectureId:number;

    constructor(data: any) {
        this.title = data.title;
        this.duration = data.duration;
        this.courseAlias = data.courseAlias;
        this.lectureId = data.lectureId;

    }
}