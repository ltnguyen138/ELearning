export class UserQuery{

    constructor(
        public page: number=1,
        public size: number=10,
        public sort: string="id,asc",
        public keyword?: string,
        public activated?: boolean,
        public role?: string
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
        if (this.activated !== undefined) {
            params.activated = this.activated;
        }
        if (this.role !== undefined) {
            params.role = this.role;
        }
        return params;
    }
}