import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage} from "../../model/order/chat-message";
import {environment} from "../../environment";

@Component({
  selector: 'app-receive-message',
  templateUrl: './receive-message.component.html',
  styleUrls: ['./receive-message.component.css']
})
export class ReceiveMessageComponent implements OnInit {

    @Input() message!: ChatMessage;
    @Input() minimized: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    protected readonly environment = environment;
}
