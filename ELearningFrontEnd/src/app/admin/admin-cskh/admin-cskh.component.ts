import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../service/chat.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ChatRoom} from "../../model/chat-room";
import {ChatMessage} from "../../model/order/chat-message";
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import {ChatMessageReq} from "../../dtos/chat/chat-message.req";
import {ChatMessageTypeEnum} from "../../enum/chat-message.type.enum";

@Component({
  selector: 'app-admin-cskh',
  templateUrl: './admin-cskh.component.html',
  styleUrls: ['./admin-cskh.component.css']
})
export class AdminCskhComponent implements OnInit {

    startReqChatRomm: ChatRoom[] = [];
    chatRooms: Map<ChatRoom, ChatMessage[]> = new Map<ChatRoom, ChatMessage[]>();
    openedChatRoom: Map<number, boolean> = new Map<number, boolean>();
    loggedInUser = this.authService.getUserFromLocalStorage();
    constructor(private chatService: ChatService,
                protected router: Router,
                private toastr: ToastrService,
                protected route: ActivatedRoute,
                private authService: AuthService,
                ) { }

    ngOnInit(): void {

        this.getActiveChatRooms();
        this.chatService.subscribeToChatRooms();
        this.chatService.subscribeToMessages(this.loggedInUser!.id);
        this.chatService.chatRoomSubject.subscribe({
            next: (data: ChatRoom) => {
                debugger;
                const index = this.startReqChatRomm.findIndex(room => room.id == data.id);
                if(index != -1 && data.active && data.adminId != null ) {
                    this.startReqChatRomm.splice(index, 1);
                }
                if(index != -1 && data.active) {
                    return;
                }
                if(index != -1 && !data.active) {
                    this.startReqChatRomm.splice(index, 1);

                }
                // if(index == -1 && !data.active) {
                //     for (let chatRoom of this.keys) {
                //         if(chatRoom.id == data.id) {
                //             this.removeChatRoom(chatRoom);
                //             break;
                //         }
                //     }
                // }
                if(index == -1 && data.active && data.adminId == null) {
                    this.startReqChatRomm.push(data);
                }
            }
        });
        this.chatService.messageSubject.subscribe({
            next: (data: ChatMessage) => {
                debugger;
                this.pushMessage(data.chatRoom, data);
            }
        });
    }

    getActiveChatRooms() {

        this.chatService.getActiveChatRooms().subscribe(
            data => {
                this.startReqChatRomm = data;
            }
        );
    }

    startChat(chatroom: ChatRoom) {

        const chatMessageReq: ChatMessageReq = {
            chatRoomId: chatroom.id,
            senderId: this.loggedInUser!.id,
            receiverId: chatroom.userId,
            message: 'Hello, how can I help you?',
            type: ChatMessageTypeEnum.START
        }
        this.chatService.sendMessage(chatMessageReq);
        this.chatRooms.set(chatroom, []);
        this.openedChatRoom.set(chatroom.id, true);
        this.startReqChatRomm.splice(this.startReqChatRomm.indexOf(chatroom), 1);
    }

    toggleViewChatRoom(chatroomId: number) {
        debugger;
        this.openedChatRoom.set(chatroomId, !this.openedChatRoom.get(chatroomId));
    }

    get keys() {
        return Array.from(this.chatRooms.keys());
    }

    pushMessage(chatroom: ChatRoom, message: ChatMessage) {

        for(let [chatRoom, messages] of this.chatRooms){
            if(chatRoom.id == chatroom.id) {
                chatRoom.adminRead = false;
                messages.push(message);
                break;
            }
        }
    }

    removeChatRoom(chatroom: ChatRoom) {
        for (let [chatRoom, messages] of this.chatRooms) {
            if(chatRoom.id == chatroom.id) {
                this.chatRooms.delete(chatRoom);
                break;
            }
        }
        this.openedChatRoom.delete(chatroom.id);
    }

    adminRead(chatroom: ChatRoom) {

        for (let chatRoom of this.keys) {
            if(chatRoom.id == chatroom.id) {
                chatRoom.adminRead = true
                break;
            }
        }
    }

    sendMessage(chatMessageReq: ChatMessageReq) {
        this.chatService.sendMessage(chatMessageReq);
    }

}
