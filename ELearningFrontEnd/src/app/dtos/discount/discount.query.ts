export class DiscountQuery {

    constructor(public page: number=1,
                public size: number=100,
                public sort: string="id,asc",
                public keyword?: string,
                public courseId?: number,
                public activated?: boolean,
                public type?: string) {
    }

    get queryParams() {
        debugger;
        const params: any = {
            page: this.page,
            size: this.size,
            sort: this.sort
        };

        if (this.keyword != undefined && this.keyword !== ''&& this.keyword !== null) {
            params.keyword = this.keyword;
        }
        if (this.courseId != undefined) {
            params.courseId = this.courseId;
        }
        if (this.activated != undefined) {
            params.activated = this.activated;
        }
        if (this.type != undefined) {
            params.type = this.type;
        }
        return params;
    }
}