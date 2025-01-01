export class CourseReq{

    name: string;
    description: string;
    categoryId: number;
    skillLevel: string;
    instructorId: number;
    price: number;

    categoryName: string;
    constructor(data: any) {
        this.name = data.name;
        this.description = data.description;
        this.categoryId = data.categoryId;
        this.skillLevel = data.skillLevel;
        this.instructorId = data.instructorId;
        this.price = data.price;

        this.categoryName = data.categoryName;
    }
}