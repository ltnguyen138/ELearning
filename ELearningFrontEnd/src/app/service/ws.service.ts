import { Injectable } from '@angular/core';
import {Client} from "@stomp/stompjs";
import {Subject} from "rxjs";
import {Notification} from "../model/notification";
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class WsService {

    public client: Client;
    public connectionPromise: Promise<void>;
    private token: string = this.tokenService.getToken() || '';
    constructor(private tokenService: TokenService) {


        this.client = new Client({
            brokerURL: 'ws://localhost:8080/ws', // URL WebSocket trên Spring Boot
            reconnectDelay: 5000,                // Tự động thử lại kết nối sau 5 giây nếu mất kết nối
            heartbeatIncoming: 4000,             // Kiểm tra heartbeat từ server mỗi 4 giây
            heartbeatOutgoing: 4000,             // Gửi heartbeat tới server mỗi 4 giây
            connectHeaders: {
                Authorization: `Bearer ${this.token}`
            },
            debug: (msg: string) => console.log(msg),  // Ghi log thông báo lỗi hoặc thông tin kết nối
        });

        // Khi kết nối thành công
        this.connectionPromise = new Promise((resolve, reject) => {
            this.client.onConnect = () => {
                console.log('Connected to WebSocket');
                resolve(); // Khi kết nối thành công, giải quyết Promise
            };

            this.client.onStompError = (frame) => {
                console.error('Broker error: ' + frame.headers['message']);
                reject(new Error('STOMP Error'));
            };

            this.client.onWebSocketClose = () => {
                console.log('WebSocket connection closed');
                reject(new Error('Connection closed'));
            };

            this.client.activate(); // Kích hoạt kết nối
        });

    }

    handleDisconnect() {
        // Thông báo cho người dùng
        alert('Mất kết nối với server, đang thử kết nối lại...');
        console.warn('Connection lost. Attempting to reconnect...');

        // Tự động kết nối lại sau 5 giây nhờ reconnectDelay đã được cấu hình ở trên
        setTimeout(() => {
            this.client.activate();  // Thử kết nối lại
        }, 5000);
    }
}
