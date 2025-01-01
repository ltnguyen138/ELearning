import { Injectable } from '@angular/core';
import {Client, Message} from "@stomp/stompjs";
import {TokenService} from "./token.service";
import {User} from "../model/user";
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {ChatRoom} from "../model/chat-room";
import {Subject} from "rxjs";
import {Notification} from "../model/notification";
import {ChatMessage} from "../model/order/chat-message";
import {ChatMessageReq} from "../dtos/chat/chat-message.req";
import {ChatMessageQuery} from "../dtos/chat/chat-message.query";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    public client: Client;
    public connectionPromise: Promise<void>;
    private token: string = this.tokenService.getToken() || '';
    private chatApi:string = environment.api + 'chat';
    public chatRoomSubject = new Subject<ChatRoom>();
    public messageSubject = new Subject<ChatMessage>();
    constructor(private tokenService: TokenService,
                private httpClient: HttpClient,
                private httpUtilsService: HttpUtilsService) {


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

    disconnect() {
        if (this.client.connected) {
            this.client.deactivate();
        }
    }

    startChat(user: User) {
        this.connectionPromise.then(() => {
            // Khi kết nối WebSocket đã sẵn sàng
            this.client.publish({
                destination: '/app/startChat.user', // Đích đến tương ứng với @MessageMapping trên server
                body: String(user.id),       // Dữ liệu gửi đi phải là chuỗi JSON
            });
            console.log('Sent user information to start chat');
        }).catch((error) => {
            console.error('Error sending user information:', error);
        });
    }

    endChat(user: User) {
        this.connectionPromise.then(() => {
            // Khi kết nối WebSocket đã sẵn sàng
            this.client.publish({
                destination: '/app/endChat.user', // Đích đến tương ứng với @MessageMapping trên server
                body: String(user.id),       // Dữ liệu gửi đi phải là chuỗi JSON
            });
            console.log('Sent user information to end chat');
        }).catch((error) => {
            console.error('Error sending user information:', error);
        });
    }

    subscribeToChatRooms() {
        this.connectionPromise.then(() => {
            this.client.subscribe('/user/topic/chat', (message) => {
                const chatRoom:ChatRoom = JSON.parse(message.body);
                console.log('Received chat room: ', chatRoom);
                this.chatRoomSubject.next(chatRoom);
            });
        }).catch(error => {
            console.error('Failed to subscribe to chat rooms: ', error);
        });
    }

    subscribeToMessages(userId: number) {
        this.connectionPromise.then(() => {
            this.client.subscribe(`/user/${userId}/message`, (message: Message) => {
                const chatMessage:ChatMessage = JSON.parse(message.body);
                console.log('Received chat message: ', chatMessage);
                this.messageSubject.next(chatMessage);
            });
        }).catch(error => {
            console.error('Failed to subscribe to messages: ', error);
        });
    }

    sendMessage(chatMessageReq: ChatMessageReq) {
        this.connectionPromise.then(() => {
            this.client.publish({
                destination: '/app/send.message',
                body: JSON.stringify(chatMessageReq),
            });
            console.log('Sent chat message: ', chatMessageReq);
        }).catch(error => {
            console.error('Error sending chat message: ', error);
        });
    }

    getChatRoomByUserId(userId: number) {
        return this.httpClient.get<ChatRoom>(this.chatApi + '/room/' + userId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getActiveChatRooms() {
        return this.httpClient.get<ChatRoom[]>(this.chatApi + '/room/active', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    toggleAdminRead(chatRoomId: number) {
        return this.httpClient.put<any>(this.chatApi + '/room/toggle-admin-read/' + chatRoomId , {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    toggleUserRead(chatRoomId: number) {
        return this.httpClient.put<any>(this.chatApi + '/room/toggle-user-read/' + chatRoomId , {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getChatMessagesHistory(chatRoomId: number, chatMessageQuery: ChatMessageQuery) {

        chatMessageQuery.page = chatMessageQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: chatMessageQuery.queryParams
        };
        chatMessageQuery.page = chatMessageQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.chatApi + '/messages/' + chatRoomId, httpOptions);
    }
}

interface GetResponse {
    content: ChatMessage[];
    totalPages: number;
}
