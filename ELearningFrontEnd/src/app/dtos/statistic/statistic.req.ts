import {StatisticTimeLineTypeEnum} from "../../enum/statistic.time-line-type.enum";
import {StatisticTypeEnum} from "../../enum/statistic.type.enum";

export class StatisticReq{

    constructor(
        public timeLineType: string = StatisticTimeLineTypeEnum.DAY,
        public statisticType: string = StatisticTypeEnum.ORDER,
        public startDate?: string,
        public endDate?: string,
        public courseId?: number,
        public categoryId?: number,
        public refunded:boolean = false,
        public timeLine: string = '7day',
        public instructorId?: number
    ) {
    }

    get queryParams() {
        const params: any = {
            timeLineType: this.timeLineType,
            statisticType: this.statisticType,
            refunded: this.refunded
        };

        if (this.startDate !== undefined) {

            params.startDate = this.convertDate(this.startDate);

        }
        if (this.endDate !== undefined) {

            params.endDate = this.convertDate(this.endDate);


        }
        if (this.courseId !== undefined) {
            params.courseId = this.courseId;
        }
        if (this.categoryId !== undefined) {
            params.categoryId = this.categoryId;
        }
        if (this.timeLine !== undefined) {
            params.timeLine = this.timeLine;
        }
        if (this.instructorId !== undefined) {
            params.instructorId = this.instructorId;
        }
        return params;
    }

    convertDate(date: string): string {

        let newDate = new Date(date)

        if (isNaN(newDate.getTime())) {
            console.log('Invalid date');
            return date;
        }
        const shortDateFormat = /^\d{2}-\d{2}-\d{4}$/;
        if(shortDateFormat.test(date)) {
            return date;
        }
        const day = ('0' + newDate.getDate()).slice(-2);   // Lấy ngày và thêm '0' nếu cần
        const month = ('0' + (newDate.getMonth() + 1)).slice(-2);  // Lấy tháng (tháng bắt đầu từ 0, nên cần cộng 1)
        const year = newDate.getFullYear();
        return `${day}-${month}-${year}`;
    }
}