import {StatisticRes} from "../dtos/statistic/statisticRes";

export interface Earning{

    startDate: Date;
    endDate: Date;
    statistics: StatisticRes[];
    totalEarning: number;
    globalDiscount: number;
    courseDiscount: number;
    fee: number;
    finalEarning: number;
}