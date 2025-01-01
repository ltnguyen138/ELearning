import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {StatisticRes} from "../../dtos/statistic/statisticRes";

@Component({
    selector: 'app-line-chart-admin-dashboard',
    templateUrl: './line-chart-admin-dashboard.component.html',
    styleUrls: ['./line-chart-admin-dashboard.component.css']
})
export class LineChartAdminDashboardComponent implements OnInit, OnChanges {

    ngOnChanges(changes: SimpleChanges): void {

        this.createData();
    }

    @Input() isAdmin : boolean = false;
    @Input() statisticsData?: StatisticRes[];
    url: string = '';
    data: any;

    options: any;

    ngOnInit() {

        if(this.isAdmin && this.isAdmin === true){
            this.url = '/admin/statistic';
        }else {
            this.url = '/instructor/earnings-management/statistics';
        }

        this.createData();

        this.options = {

            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {

                    mode: 'index',  // Hiển thị dữ liệu của cả nhóm tại một nhãn khi hover vào bất kỳ cột nào trong nhóm đó
                    intersect: false, // Đảm bảo tooltip xuất hiện ngay cả khi không hover chính xác vào một cột cụ thể
                    callbacks: {
                        label: (tooltipItem: any) => {
                            const currentValue = tooltipItem.raw;
                            const formattedValue = new Intl.NumberFormat('vi-VN').format(currentValue); // Định dạng giá trị thành 1.200.000
                            return `Doanh thu: ${formattedValue} VND  `; // Hiển thị giá trị và phần trăm
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
                        color: "#ffffff",
                        font: {
                            size: 14 // Tăng kích thước chữ lên 16px (tuỳ chỉnh theo nhu cầu)
                        },
                    },
                    grid: {
                        color: "#172B4D",
                        drawBorder: true
                    }
                },
                y: {
                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 14
                        },
                        callback: (value: number) => {
                            const formattedValue = new Intl.NumberFormat('vi-VN').format(value);
                            return `${formattedValue} VND`;
                        }

                    },
                    grid: {
                        color: "#ffffff",
                        drawBorder: false,

                    },
                    suggestedMin: 0, // Gợi ý giá trị nhỏ nhất
                    suggestedMax: 80
                }
            }
        };
    }

    createData(){
        const labels = this.statisticsData?.map(statistic => statistic.identifier);
        const finalPrice = this.statisticsData?.map(statistic => statistic.finalPrice);
        console.log(finalPrice);
        this.data = {
            labels: labels,
            datasets: [
                {
                    label: 'Doanh thu',
                    data: finalPrice,
                    fill: false,
                    borderColor: '#a7b1ee' ,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#ffffff',
                }
            ]
        };
    }
}
