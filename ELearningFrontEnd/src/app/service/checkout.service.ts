import { Injectable } from '@angular/core';
import {Client, Message} from "@stomp/stompjs";
import {Subject} from "rxjs";
import {Notification} from "../model/notification";
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
    private client: Client;
    public mesSubject = new Subject<string>();
    private connectionPromise: Promise<void>;
    private notiApi = environment.api + 'notifications';

    constructor(private httpClient: HttpClient,
                private httpUtilsService: HttpUtilsService,
                private tokenService: TokenService) {
        this.client = new Client({
            brokerURL: 'ws://localhost:8080/ws', // URL WebSocket trên Spring Boot
            reconnectDelay: 5000,                // Tự động thử lại kết nối sau 5 giây nếu mất kết nối
            heartbeatIncoming: 4000,             // Kiểm tra heartbeat từ server mỗi 4 giây
            heartbeatOutgoing: 4000,             // Gửi heartbeat tới server mỗi 4 giây

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

    subscribeToMess(userId: number) {
        this.connectionPromise.then(() => {
            this.client.subscribe(`/user/${userId}/checkout`, (message: Message) => {
                const mes = message.body;
                console.log('Received notification: ', mes);
                this.mesSubject.next(mes);

            });
        }).catch(error => {
            console.error('Failed to subscribe to checkout: ', error);
        });
    }
}
