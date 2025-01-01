export class LectureQuery{

    constructor(
        public page: number=1,
        public size: number=100,
        public sort: string="orderNumber,asc",
        public chapterId?: number,
        public approvalStatus?: string
    ) {
    }

    get queryParams() {
        const params: any = {
            page: this.page,
            size: this.size,
            sort: this.sort
        };

        if (this.chapterId !== undefined) {
            params.chapterId = this.chapterId;
        }
        if (this.approvalStatus !== undefined) {
            params.approvalStatus = this.approvalStatus;
        }
        return params;
    }
}