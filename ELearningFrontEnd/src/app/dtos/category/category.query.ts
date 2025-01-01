export class CategoryQuery{

    constructor(
        public page: number=1,
        public size: number=100,
        public sort: string="id,asc",
        public keyword?: string,
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
        return params;
    }
}