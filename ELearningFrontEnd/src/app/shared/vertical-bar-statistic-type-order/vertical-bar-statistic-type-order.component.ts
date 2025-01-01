import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {StatisticRes} from "../../dtos/statistic/statisticRes";

@Component({
    selector: 'app-vertical-bar-statistic-type-order',
    templateUrl: './vertical-bar-statistic-type-order.component.html',
    styleUrls: ['./vertical-bar-statistic-type-order.component.css']
})
export class VerticalBarStatisticTypeOrderComponent implements OnInit, OnChanges {

    @Input() statisticsData?: StatisticRes[];
    @Input() title?: string;
    data: any;
    options: any;
    @Input()minWidth: boolean = false;
    ngOnInit(): void {
        this.createData();
        this.createOptions();
    }


    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.createData();
        this.createOptions();
    }

    createData(){

        const totalPrice = this.statisticsData?.map(value => value.totalPrice);
        const finalPrice = this.statisticsData?.map(value => value.finalPrice);
        const discount = this.statisticsData?.map(value => value.globalDiscount + value.courseDiscount);
        const labels = this.statisticsData?.map(value => value.identifier);
        this.data = {
            labels: labels,
            datasets: [
                {
                    label: 'Giá gốc',
                    backgroundColor: "#4876FF",
                    borderColor: "#4876FF",
                    data: totalPrice
                },
                {
                    label: 'Tiền giảm giá',
                    backgroundColor: "#00CD00",
                    borderColor: "#00CD00",
                    data: discount
                },
                {
                    label: 'Doanh thu',
                    backgroundColor: "#FFA500",
                    borderColor: "#FFA500",
                    data: finalPrice
                }
            ]
        };
    }

    createOptions(){
        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: "#333"
                    }
                },
                tooltip: {
                    mode: 'index',  // Hiển thị dữ liệu của cả nhóm tại một nhãn khi hover vào bất kỳ cột nào trong nhóm đó
                    intersect: false, // Đảm bảo tooltip xuất hiện ngay cả khi không hover chính xác vào một cột cụ thể
                    callbacks: {
                        label: (tooltipItem: any) => {
                            const currentValue = tooltipItem.raw;
                            const formattedValue = new Intl.NumberFormat('vi-VN').format(currentValue); // Định dạng giá trị thành 1.200.000
                            return `${tooltipItem.dataset.label}: ${formattedValue} VND`; // Hiển thị giá trị và phần trăm
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
            },
            scales: {
                x: {
                    ticks: {
                        color: "#333",
                        font: {
                            weight: 500,
                            size: 14
                        }
                    },
                    grid: {
                        color: "#DDDDDD",
                        drawBorder: false
                    },

                },
                y: {
                    ticks: {
                        color: "#333",
                        font: {
                            weight: 500,
                            size: 14
                        },
                        callback: (value: number) => {
                            const formattedValue = new Intl.NumberFormat('vi-VN').format(value);
                            return `${formattedValue} VND`;
                        }
                    },
                    grid: {
                        color: "#DDDDDD",
                        drawBorder: false
                    }
                }

            }
        };
    }


}
