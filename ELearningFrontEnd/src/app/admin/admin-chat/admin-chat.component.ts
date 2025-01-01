import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ChatRoom} from "../../model/chat-room";
import {ChatMessage} from "../../model/order/chat-message";
import {ChatMessageTypeEnum} from "../../enum/chat-message.type.enum";
import {AuthService} from "../../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../../service/chat.service";
import {ToastrService} from "ngx-toastr";
import { User } from 'src/app/model/user';
import {UserService} from "../../service/user.service";
import {ChatMessageReq} from "../../dtos/chat/chat-message.req";

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css']
})
export class AdminChatComponent implements  OnInit{

    loggedUser = this.authService.getUserFromLocalStorage();
    user!: User;
    @Input() chatRoom!: ChatRoom;
    @Input() viewChatRoom = false;
    @Input() chatMessages: ChatMessage[] = [];
    @Output() toggleViewChatRoom = new EventEmitter<number>();
    @Output() sendMessage = new EventEmitter<ChatMessageReq>();
    @Output() closeChatRoom = new EventEmitter<ChatRoom>();
    @ViewChild('contentChat') private contentChat!: ElementRef;
    endChat = false;
    message: string = '';
    //     {
    //         id: 1,
    //         sender: {
    //             id: 2,
    //             fullName: 'Admin',
    //             email: '',
    //             phoneNumber: '',
    //             address: '',
    //             title: '',
    //             bio: '',
    //             profilePicture: this.loggedUser!.profilePicture,
    //             birthDate: new Date(),
    //             role: {
    //                 id: 1,
    //                 name: 'ROLE_ADMIN'
    //             },
    //             createdTime: new Date(),
    //             updatedTime: new Date(),
    //             activated: true,
    //             roleName: 'Admin',
    //
    //         },
    //         chatRoom: this.chatRoom!,
    //         message: 'Hello, how can I help you?',
    //         timestamp: new Date(),
    //         type: ChatMessageTypeEnum.CHAT,
    //         receiver: {
    //             id: 3,
    //             fullName: 'sc',
    //             email: '',
    //             phoneNumber: '',
    //             address: '',
    //             title: '',
    //             bio: '',
    //             profilePicture: this.loggedUser!.profilePicture,
    //             birthDate: new Date(),
    //             role: {
    //                 id: 1,
    //                 name: 'ROLE_ADMIN'
    //             },
    //             createdTime: new Date(),
    //             updatedTime: new Date(),
    //             activated: true,
    //             roleName: 'Admin',
    //
    //         },
    //
    //     },
    //     {
    //         id: 2,
    //         sender: {
    //             id: 3,
    //             fullName: 'sc',
    //             email: '',
    //             phoneNumber: '',
    //             address: '',
    //             title: '',
    //             bio: '',
    //             profilePicture: this.loggedUser!.profilePicture,
    //             birthDate: new Date(),
    //             role: {
    //                 id: 1,
    //                 name: 'ROLE_ADMIN'
    //             },
    //             createdTime: new Date(),
    //             updatedTime: new Date(),
    //             activated: true,
    //             roleName: 'Admin',
    //
    //         },
    //         chatRoom: this.chatRoom!,
    //         message: 'I need help',
    //         timestamp: new Date(),
    //         type: ChatMessageTypeEnum.CHAT,
    //         receiver: {
    //             id: 2,
    //             fullName: 'Admin',
    //             email: '',
    //             phoneNumber: '',
    //             address: '',
    //             title: '',
    //             bio: '',
    //             profilePicture: this.loggedUser!.profilePicture,
    //             birthDate: new Date(),
    //             role: {
    //                 id: 1,
    //                 name: 'ROLE_ADMIN'
    //             },
    //             createdTime: new Date(),
    //             updatedTime: new Date(),
    //             activated: true,
    //             roleName: 'Admin',
    //         }
    //     }
    //
    // ];
    constructor(private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private userService: UserService) { }

    ngOnInit(): void {
        this.getUser();
    }

    toggleViewChatRoomEvent() {
        this.toggleViewChatRoom.emit(this.chatRoom.id);
    }

    getUser(){
        this.userService.getUser(this.chatRoom.userId).subscribe(
            data => {
                this.user = data;
            }
        );
    }

    sendMessageEvent() {
        if(this.message === '') {
            return;
        }
        const chatMessage: ChatMessage = {
            id: 0,
            sender: this.loggedUser!,
            chatRoom: this.chatRoom,
            message: this.message,
            timestamp: new Date(),
            type: ChatMessageTypeEnum.CHAT,
            receiver: this.user
        }
        this.chatMessages.push(chatMessage);
        const chatMessageReq: ChatMessageReq = {
            chatRoomId: this.chatRoom.id,
            senderId: this.loggedUser!.id,
            receiverId: this.user.id,
            message: this.message,
            type: ChatMessageTypeEnum.CHAT
        }
        this.sendMessage.emit(chatMessageReq);
        this.message = '';
        this.scrollToBottom();
    }

    closeChatRoomEvent() {
        this.closeChatRoom.emit(this.chatRoom);
    }

    setEndChatTrue(): boolean {
        this.endChat = true;
        return true; // Return true to satisfy the *ngIf directive
    }

    getMessagesUntilEnd(): ChatMessage[] {
        const index = this.chatMessages.findIndex(message => message.type === ChatMessageTypeEnum.END);
        // Nếu không tìm thấy END, trả về toàn bộ tin nhắn
        if (index === -1) {
            return this.chatMessages;
        }
        // Nếu tìm thấy, trả về các tin nhắn trước END (bao gồm cả END)
        return this.chatMessages.slice(0, index + 1);
    }

    scrollToBottom(): void {
        try {
            setTimeout(() => {
                this.contentChat.nativeElement.scrollTop = this.contentChat.nativeElement.scrollHeight;
            }, 0);
        } catch (err) {
            console.error('Scroll error:', err);
        }
    }

    protected readonly ChatMessageTypeEnum = ChatMessageTypeEnum;
}
