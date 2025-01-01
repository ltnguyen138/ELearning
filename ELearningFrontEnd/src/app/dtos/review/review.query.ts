export class ReviewQuery{

    constructor(
        public page: number=1,
        public size: number=100,
        public sort: string="id,asc",
        public keyword?: string,
        public rating?: number,
        public courseId?: number,
        public courseName?: string,
        public comment?: string,

    ) {
    }

    get queryParams() {
        const params: any = {
            page: this.page,
            size: this.size,
            sort: this.sort
        };

        if (this.keyword !== undefined) {
            params.keyword = this.keyword;
        }
        if (typeof this.rating !== 'undefined' && this.rating != -1) {
            debugger;
            params.rating = this.rating;
        }
        if (this.courseId !== undefined && this.courseId != -1) {
            params.courseId = this.courseId;
        }

        if (this.comment !== undefined) {
            params.comment = this.comment;
        }
        return params;
    }
}