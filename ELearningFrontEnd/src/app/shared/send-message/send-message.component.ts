import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage} from "../../model/order/chat-message";
import {environment} from "../../environment";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {

    @Input() message!: ChatMessage;
    @Input() minimized: boolean = false;
    constructor(private datePipe: DatePipe) { }

    ngOnInit(): void {
    }

    isValidDate(dateString: any): boolean {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    formatTimestamp(timestamp: any): string {
        if (this.isValidDate(timestamp)) {
            return this.datePipe.transform(timestamp, 'dd-MM-yyyy HH:mm') ?? timestamp;
        }
        return timestamp; // Trả về chuỗi gốc nếu không hợp lệ
    }

    protected readonly environment = environment;
}
