import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import {Observable, Subject} from 'rxjs';
import {Notification} from "../model/notification";
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {environment} from "../environment";
import {NotificationQuery} from "../dtos/notification/notification.query";
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
    private client: Client;
    public notificationSubject = new Subject<Notification>();
    private connectionPromise: Promise<void>;
    private notiApi = environment.api + 'notifications';
    private token: string = this.tokenService.getToken() || '';
    constructor(private httpClient: HttpClient,
                private httpUtilsService: HttpUtilsService,
                private tokenService: TokenService) {
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

// Hàm xử lý khi mất kết nối
    handleDisconnect() {
        // Thông báo cho người dùng
        alert('Mất kết nối với server, đang thử kết nối lại...');
        console.warn('Connection lost. Attempting to reconnect...');

        // Tự động kết nối lại sau 5 giây nhờ reconnectDelay đã được cấu hình ở trên
        setTimeout(() => {
            this.client.activate();  // Thử kết nối lại
        }, 5000);
    }

    subscribeToNotifications(userId: number) {
        this.connectionPromise.then(() => {
            this.client.subscribe(`/user/${userId}/notification`, (message: Message) => {
                const notification = JSON.parse(message.body)
                console.log('Received notification: ', notification);
                this.notificationSubject.next(notification);

            });
        }).catch(error => {
            console.error('Failed to subscribe to notifications: ', error);
        });
    }

    disconnect() {
        if (this.client.connected) {
            this.client.deactivate();
        }
    }

    getTop4UnreadNotifications() {
        return this.httpClient.get<Notification[]>(this.notiApi + '/top4/unread', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getTop4Notifications() {
        return this.httpClient.get<Notification[]>(this.notiApi + '/top4', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    readNotification(id: number) {
        return this.httpClient.put(this.notiApi + '/read/'+ id, {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getPage(query: NotificationQuery) {
        query.page = query.page - 1;
        let params = query.queryParams;
        query.page = query.page + 1;
        return this.httpClient.get<any>(this.notiApi, {params: params, headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    readAll():Observable<any>{
        return this.httpClient.put(this.notiApi + '/read/all', {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteNotification(id: number) {
        return this.httpClient.delete<any>(this.notiApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
}
