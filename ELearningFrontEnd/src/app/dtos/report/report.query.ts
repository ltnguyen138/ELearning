export class ReportQuery{

    constructor(
        public page: number=1,
        public size: number=100,
        public sort: string="id,asc",
        public userId?: number,
        public entityType?: string,
        public entityId?: number,
        public reason?: string,
        public status?: string,
    ) {
    }

    get queryParams() {
        const params: any = {
            page: this.page,
            size: this.size,
            sort: this.sort
        };

        if (this.userId !== undefined) {
            params.userId = this.userId;
        }
        if (this.entityType !== undefined) {
            params.entityType = this.entityType;
        }
        if (this.entityId !== undefined) {
            params.entityId = this.entityId;
        }
        if (this.reason !== undefined) {
            params.reason = this.reason;
        }
        if (this.status !== undefined) {
            params.status = this.status;
        }
        return params;
    }
}