export class UserCourseQuery{

    constructor(
        public page: number = 1,
        public size: number = 10,
        public sort: string = 'id',
        public keyword?: string,
        public categoryId?: number,
        public userId?: number,
    ) {
    }

    get queryParams() {
        const params: any = {
            page: this.page,
            size: this.size,
            sort: this.sort
        };

        if (this.keyword !== undefined && this.keyword !== '' && this.keyword !== null) {
            params.keyword = this.keyword;
        }
        if (this.categoryId !== undefined && this.categoryId !== -1) {
            params.categoryId = this.categoryId;
        }
        if (this.userId !== undefined && this.userId !== -1) {
            params.userId = this.userId;
        }
        return params;
    }
}