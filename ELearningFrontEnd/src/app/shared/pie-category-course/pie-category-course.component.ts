import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import _default from "chart.js/dist/plugins/plugin.tooltip";
import backgroundColor = _default.defaults.backgroundColor;
import {StatisticRes} from "../../dtos/statistic/statisticRes";

@Component({
    selector: 'app-pie-category-course',
    templateUrl: './pie-category-course.component.html',
    styleUrls: ['./pie-category-course.component.css']
})
export class PieCategoryCourseComponent implements OnInit, OnChanges {

    @Input() isAdmin : boolean = false;
    @Input() statisticsData?: StatisticRes[];
    url: string = '';
    data: any;
    options: any;

    backgroundColor: string[] = [
        '#fd5074', '#3ea7ee', '#fcd168', '#4BC0C0', '#9966FF',
        '#fca34c', '#de6dde', '#9854dc', '#FF8A80', '#EA80FC',
        '#7183e3', '#6cc6ee', '#70f3d5', '#CCFF90', '#FFFF8D'
    ];
    hoverBackgroundColor: string[] = [
        '#f82b58', '#1b8ede', '#fdc743', '#3abdbd', '#9966FF',
        '#e07c1c', '#d73dd7', '#8636d5', '#d5675d', '#EA80FC',
        '#5869be', '#2490c0', '#62dabf', '#6ba824', '#FFFF8D'
    ];

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {

        this.createData();
    }

    ngOnInit(): void {

        if(this.isAdmin && this.isAdmin === true){
            this.url = '/admin/courses';
        }else {
            this.url = '/instructor/courses';
        }

        this.createData();
        this.options = {
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: "#333",
                        font: {
                            size: 16 // Tăng kích thước chữ lên 16px (tuỳ chỉnh theo nhu cầu)
                        }
                    },

                },
                tooltip: {
                    mode: 'index',  // Hiển thị dữ liệu của cả nhóm tại một nhãn khi hover vào bất kỳ cột nào trong nhóm đó
                    callbacks: {
                        label: (tooltipItem: any) => {
                            const total = tooltipItem.dataset.data.reduce((acc: number, value: number) => acc + value, 0); // Tính tổng tất cả giá trị
                            const currentValue = tooltipItem.raw;
                            const percentage = ((currentValue / total) * 100).toFixed(2); // Tính phần trăm và làm tròn 2 chữ số thập phân
                            return `Số lượng khóa học: ${currentValue}  (${percentage}%)`; // Hiển thị giá trị và phần trăm
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

    createData() {

        const labels = this.statisticsData?.map(value => value.identifier);
        const data = this.statisticsData?.map(value => value.countCourse);

        this.data = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: this.backgroundColor,
                    hoverBackgroundColor: this.hoverBackgroundColor
                }
            ]
        };
    }


}
