export class ChapterQuery{

    constructor(
        public page: number=1,
        public size: number=100,
        public sort: string="orderNumber,asc",
        public keyword?: string,
        public courseId?: number,
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
        if (this.courseId !== undefined) {
            params.courseId = this.courseId;
        }
        return params;
    }
}