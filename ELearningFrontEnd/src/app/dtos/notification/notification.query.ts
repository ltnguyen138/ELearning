export class NotificationQuery{

    page: number = 1;
    size: number = 10;
    sort: string = 'timestamp,desc';

    constructor(){
    }

    get queryParams() {
        const params: any = {
            page: this.page,
            size: this.size,
            sort: this.sort
        };

        return params;
    }
}