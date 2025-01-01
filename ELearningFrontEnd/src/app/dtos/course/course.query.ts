export class CourseQuery{

    constructor(
        public page: number=1,
        public size: number=100,
        public sort: string="createdTime,desc",
        public keyword?: string,
        public categoryId?: number,
        public instructorId?: number,
        public skillLevel?: string,
        public minPrice?: number,
        public maxPrice?: number,
        public activated?: boolean,
        public alias?: string,
        public averageRating?: number,
        public moderationRequested?: boolean,
        public approvalStatus?: string,
        public instructorName?: string,

    ) {
    }
    get queryParams() {
        const params: any = {
            page: this.page,
            size: this.size,
            sort: this.sort
        };

        if(this.instructorName !== undefined){
            params.instructorName = this.instructorName;
        }
        if (this.keyword !== undefined && this.keyword !== ''&& this.keyword !== null) {
            params.keyword = this.keyword;
        }
        if (this.categoryId !== undefined && this.categoryId !== -1) {
            params.categoryId = this.categoryId;
        }
        if (this.instructorId !== undefined && this.instructorId !== -1) {
            params.instructorId = this.instructorId;
        }
        if (this.skillLevel !== undefined) {
            params.skillLevel = this.skillLevel;
        }
        if (this.minPrice !== undefined) {
            params.minPrice = this.minPrice;
        }
        if (this.maxPrice !== undefined) {
            params.maxPrice = this.maxPrice;
        }
        if (this.activated !== undefined) {
            params.activated = this.activated;
        }
        if (this.alias !== undefined) {
            params.alias = this.alias;
        }
        if (this.averageRating !== undefined) {
            params.averageRating = this.averageRating;
        }
        if(this.moderationRequested !== undefined){
            params.moderationRequested = this.moderationRequested;
        }
        if(this.approvalStatus !== undefined){
            params.approvalStatus = this.approvalStatus;
        }
        return params;
    }
}