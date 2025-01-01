export class OrderQuery{

    constructor(
        public page: number=1,
        public size: number=8,
        public sort: string="createdTime,desc",
        public keyword?: string,
        public status?: string,
        public userId?: number
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
        if(this.status !== undefined){
            params.status = this.status;
        }
        if(this.userId !== undefined){
            params.userId = this.userId;
        }
        return params;
    }
}