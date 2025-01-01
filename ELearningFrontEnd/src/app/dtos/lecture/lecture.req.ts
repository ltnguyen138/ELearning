export class LectureReq{

    name: string;
    chapterId: number;
    preview: boolean;

    constructor(data: any) {
        this.name = data.name;
        this.chapterId = data.chapterId;
        this.preview = data.preview;
    }
}