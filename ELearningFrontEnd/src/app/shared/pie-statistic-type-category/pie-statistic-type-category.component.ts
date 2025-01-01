import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {StatisticRes} from "../../dtos/statistic/statisticRes";

@Component({
    selector: 'app-pie-statistic-type-category',
    templateUrl: './pie-statistic-type-category.component.html',
    styleUrls: ['./pie-statistic-type-category.component.css']
})
export class PieStatisticTypeCategoryComponent implements OnInit, OnChanges {

    @Input() statisticsData?: StatisticRes[];
    @Input() title?: string;
    options: any;
    totalPriceData: any;
    finalPriceData: any;
    discountData: any;
    backgroundColor: string[] = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#E7E9ED', '#C9CBCF', '#FF8A80', '#EA80FC',
        '#8C9EFF', '#80D8FF', '#A7FFEB', '#CCFF90', '#FFFF8D'
    ];
    hoverBackgroundColor: string[] = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#E7E9ED', '#C9CBCF', '#FF8A80', '#EA80FC',
        '#8C9EFF', '#80D8FF', '#A7FFEB', '#CCFF90', '#FFFF8D'
    ];

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.createTotalPriceData();
        this.createOptions();
        this.createFinalPriceData();
        this.createDiscountData();
    }
    ngOnInit(): void {
    }

    createTotalPriceData(){
        const totalPrice = this.statisticsData?.map(value => value.totalPrice);
        const labels = this.statisticsData?.map(value => value.identifier);
        this.totalPriceData = {
            labels: labels,
            datasets: [
                {
                    label: 'Giá gốc',
                    backgroundColor: this.backgroundColor,
                    borderColor: this.hoverBackgroundColor,
                    data: totalPrice
                }
            ]
        };
    }

    createFinalPriceData(){
        const finalPrice = this.statisticsData?.map(value => value.finalPrice);
        const labels = this.statisticsData?.map(value => value.identifier);
        this.finalPriceData = {
            labels: labels,
            datasets: [
                {
                    label: 'Doanh thu',
                    backgroundColor: this.backgroundColor,
                    borderColor: this.hoverBackgroundColor,
                    data: finalPrice
                }
            ]
        };
    }

    createDiscountData(){
        const discount = this.statisticsData?.map(value => value.globalDiscount+value.courseDiscount);
        const labels = this.statisticsData?.map(value => value.identifier);
        this.discountData = {
            labels: labels,
            datasets: [
                {
                    label: 'Giảm giá',
                    backgroundColor: this.backgroundColor,
                    borderColor: this.hoverBackgroundColor,
                    data: discount
                }
            ]
        };
    }

    createOptions(){
        this.options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: "#333",
                        font: {
                            size: 16 // Tăng kích thước chữ lên 16px (tuỳ chỉnh theo nhu cầu)
                        }
                    }
                },
                tooltip: {
                    mode: 'index',  // Hiển thị dữ liệu của cả nhóm tại một nhãn khi hover vào bất kỳ cột nào trong nhóm đó

                    callbacks: {
                        label: (tooltipItem: any) => {
                            const total = tooltipItem.dataset.data.reduce((acc: number, value: number) => acc + value, 0); // Tính tổng tất cả giá trị
                            const currentValue = tooltipItem.raw;
                            const percentage = ((currentValue / total) * 100).toFixed(2); // Tính phần trăm và làm tròn 2 chữ số thập phân
                            const formattedValue = new Intl.NumberFormat('vi-VN').format(currentValue); // Định dạng giá trị thành 1.200.000
                            return `${tooltipItem.dataset.label}: ${formattedValue} VND (${percentage}%)`; // Hiển thị giá trị và phần trăm
                        }
                    },
                    bodyFont: {
                        size: 14, // Tăng kích thước font (16px)
                        weight: 'bold' // Có thể thêm đậm
                    },
                    titleFont: {
                        size: 16 // Kích thước cho tiêu đề của tooltip
                    },
                    padding: 20,
                }
            }
        };
    }
}
