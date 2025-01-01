import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {StatisticRes} from "../../dtos/statistic/statisticRes";

@Component({
    selector: 'app-vertical-bar-order',
    templateUrl: './vertical-bar-order.component.html',
    styleUrls: ['./vertical-bar-order.component.css']
})
export class VerticalBarOrderComponent implements OnInit, OnChanges {
    ngOnChanges(changes: SimpleChanges): void {

        this.createData();
    }

    @Input() statisticsData?: StatisticRes[];
    @Input() isAdmin : boolean = false;
    data: any;
    options: any;
    ngOnInit() {

        this.createData();



    }

    createData() {

        const labels = this.statisticsData?.map(statistic => statistic.identifier);
        const countOrders = this.statisticsData?.map(statistic => statistic.countOrders);
        const min = countOrders ? Math.min(...countOrders) : 0;
        const max = countOrders ? Math.max(...countOrders) + 10: 0;
        const step = Math.ceil((max - min) / 5);
        console.log('min', min);
        console.log('max', max);
        console.log('step', step);
        this.data = {
            labels: labels,
            datasets: [
                {
                    label: 'Số lượng đơn hàng',
                    data: countOrders,
                    fill: false,
                    backgroundColor: '#FB6340',
                    borderColor: '#f6380c',
                    tension: 0.4,
                }
            ]
        };
        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
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
                    barPercentage: 0.1,
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
                    }
                },
                y: {
                    ticks: {
                        color: "#333",
                        font: {
                            size: 14 // Tăng kích thước chữ lên 16px (tuỳ chỉnh theo nhu cầu)
                        },
                        stepSize: step,
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
