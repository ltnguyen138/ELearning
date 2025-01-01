export class CategoryReq{

    name: string;
    activated: boolean

    constructor(data: any) {
        this.name = data.name;
        this.activated = data.activated
    }
}