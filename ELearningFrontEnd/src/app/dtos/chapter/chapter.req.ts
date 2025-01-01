import {Lecture} from "../../model/lecture";
import {LectureReq} from "../lecture/lecture.req";

export class ChapterReq{

    name: string;
    courseId: number;
    lectures: LectureReq[] | null;

    constructor(data: any) {
        this.name = data.name;
        this.courseId = data.courseId;
        this.lectures = data.lectures
    }
}