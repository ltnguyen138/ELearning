export class QuestionAnswerQuery{

    constructor(
        public page: number=1,
        public size: number=10,
        public sort: string="createdTime,desc",
        public keyword?: string,
        public lectureId?: number,
        public courseId?: number,
        public questionId?: number,
    ) {
    }

    get queryParams() {
        const params: any = {
            page: this.page,
            size: this.size,
            sort: this.sort
        };

        if(this.questionId !== undefined && this.questionId != -1){
            params.questionId = this.questionId;
        }

        if (this.keyword !== undefined && this.keyword != '') {
            params.keyword = this.keyword;
        }
        if (this.lectureId !== undefined && this.lectureId != -1) {
            params.lectureId = this.lectureId;
        }
        if (this.courseId !== undefined && this.courseId != -1) {
            params.courseId = this.courseId;
        }

        return params;
    }
}