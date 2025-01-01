import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {StatisticRes} from "../../dtos/statistic/statisticRes";
import { ColDef,
    ColGroupDef,
    GridApi,
    GridOptions,
    GridReadyEvent,
    ModuleRegistry,
    createGrid,} from 'ag-grid-community'; // Column Definition Type Interface

@Component({
  selector: 'app-grid-statistic-type-course',
  templateUrl: './grid-statistic-type-course.component.html',
  styleUrls: ['./grid-statistic-type-course.component.css']
})
export class GridStatisticTypeCourseComponent implements  OnInit, OnChanges{

    @Input() statisticsData?: StatisticRes[];
    @Input() title?: string;
    @Input() refunded?: boolean;
    paginationPageSize = 10;
    paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
    themeClass: string = "ag-theme-quartz";
    rowSelection: "single" | "multiple" = "multiple";
    defaultColDef: ColDef = {
        filter: "agTextColumnFilter",
        floatingFilter: true,
        headerClass: 'header-center',
    };
    rowData: any[] = [];
    colDefs: ColDef[] = [
        { field: "Tên khóa học",flex: 2 },
        { field: "Giá gốc",flex: 1  , cellStyle: { textAlign: 'center' }},

        { field: "Khuyến mãi từ hệ thống" ,flex: 1 , cellStyle: { textAlign: 'center' } },
        { field: "Khuyến mãi từ khóa học" ,flex: 1 , cellStyle: { textAlign: 'center' } },
        { field: "Doanh thu" ,flex: 1 , cellStyle: { textAlign: 'center' } },
        { field: "Số lượng mua" ,flex: 1, cellStyle: { textAlign: 'center' }  },
    ];
    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {

        console.log('this.statisticsData',this.statisticsData);
        if(this.statisticsData){
            this.rowData = this.getDataForProductReport();
        }
        this.getColDefs(this.refunded!);

    }



    constructor() {
    }


    getDataForProductReport(){
        const revenueLabel = this.refunded ? "Số tiền hoàn" : "Doanh thu";
        return  this.statisticsData!.map(report => {
            return {
                "Tên khóa học": report.identifier,
                "Giá gốc": this.roundAndFormatNumber(report.totalPrice),
                "Khuyến mãi từ hệ thống": this.roundAndFormatNumber(report.globalDiscount),
                "Khuyến mãi từ khóa học": this.roundAndFormatNumber(report.courseDiscount),
                [revenueLabel]: this.roundAndFormatNumber(report.finalPrice),
                "Số lượng mua": report.countCourse
            }
        })

    }

    roundAndFormatNumber(number: number){
        let roundNumber = Math.round(number);
        const formattedValue = new Intl.NumberFormat('vi-VN').format(roundNumber);
        return `${formattedValue} VND`;
    }

    getColDefs(refunded: boolean) {
        this.colDefs = [
            { field: "Tên khóa học", flex: 2 },
            { field: "Giá gốc", flex: 1, cellStyle: { textAlign: 'center' }},
            { field: "Khuyến mãi từ hệ thống" ,flex: 1 , cellStyle: { textAlign: 'center' } },
            { field: "Khuyến mãi từ khóa học" ,flex: 1 , cellStyle: { textAlign: 'center' } },
            { field: refunded ? "Số tiền hoàn" : "Doanh thu", flex: 1, cellStyle: { textAlign: 'center' }},
            { field: "Số lượng mua", flex: 1, cellStyle: { textAlign: 'center' }},
        ];
    }
}
