export class NoteQuery{

    constructor(
        public page: number=1,
        public size: number=4,
        public sort: string="createdAt,desc",
        public courseAlias?: string,
        public userId?: number,
        public lectureId?: number,
        public title?: string,
    ) {
    }

    get queryParams() {
        const params: any = {
            page: this.page,
            size: this.size,
            sort: this.sort
        };

        if (this.courseAlias !== undefined) {
            params.courseAlias = this.courseAlias;
        }
        if (this.userId !== undefined) {
            params.userId = this.userId;
        }
        if (this.lectureId !== undefined && this.lectureId != -1) {
            params.lectureId = this.lectureId;
        }
        if (this.title !== undefined && this.title != '') {
            params.title = this.title;
        }

        return params;
    }
}