import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../../service/chat.service";
import {ToastrService} from "ngx-toastr";
import {ChatRoom} from "../../model/chat-room";
import {ChatMessage} from "../../model/order/chat-message";
import {ChatMessageTypeEnum} from "../../enum/chat-message.type.enum";
import {User} from "../../model/user";
import {ChatMessageQuery} from "../../dtos/chat/chat-message.query";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

    loggedUser = this.authService.getUserFromLocalStorage();
    chatRoom?: ChatRoom;
    isAdminActive = false;
    mesaage = '';
    adminUser?: User;
    @ViewChild('contentChat') private contentChat!: ElementRef;
    chatMessages: ChatMessage[] = []
    page = 1;
    chatMessageQuery: ChatMessageQuery = new ChatMessageQuery();
    private chatHistoryLoaded$ = new Subject<void>();
    isLoaded = false;
    constructor(private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private chatService: ChatService,
                private toastr: ToastrService) { }

    ngOnInit(): void {
        this.getMyChatRoom();
        this.chatService.subscribeToMessages(this.loggedUser!.id);
        this.chatService.messageSubject.subscribe({
            next: (message) => {
                this.chatRoom!.userRead = false;
                this.chatMessages.push(message);
                if(message.type == ChatMessageTypeEnum.START){
                    this.isAdminActive = true;
                    this.chatRoom!.adminId = message.sender.id;
                    this.adminUser = message.sender;
                }
                if(message.type == ChatMessageTypeEnum.END){
                    this.isAdminActive = false;
                    this.chatRoom!.adminId = null;
                    this.chatRoom!.active = false;
                }
            },
            error: (error) => {
                this.toastr.error('Failed to get chat message: ' + error.message);
            }
        });
    }

    ngOnDestroy(): void {
        this.chatService.disconnect();
    }

    startChat(){
        this.chatService.startChat(this.loggedUser!);
        this.chatRoom!.active = true;

    }

    getMyChatRoom(){
        this.chatService.getChatRoomByUserId(this.loggedUser!.id).subscribe({
            next: (chatRoom) => {
                this.chatRoom = chatRoom;
                debugger;
                this.getChatMessageHistory();
                this.scrollToBottom();
            },
            error: (error) => {
                this.toastr.error('Failed to get chat room: ' + error.message);
            }
        })
    }

    sendMessage(){
        if(this.mesaage === '') {
            return;
        }
        const chatMessage: ChatMessage = {
            id: 0,
            sender: this.loggedUser!,
            chatRoom: this.chatRoom!,
            message: this.mesaage,
            timestamp: new Date(),
            type: ChatMessageTypeEnum.CHAT,
            receiver: this.adminUser!
        }
        this.chatMessages.push(chatMessage);
        const chatMessageReq = {
            chatRoomId: this.chatRoom!.id,
            senderId: this.loggedUser!.id,
            receiverId: this.adminUser!.id,
            message: this.mesaage,
            type: ChatMessageTypeEnum.CHAT
        }
        this.chatService.sendMessage(chatMessageReq);
        this.mesaage = '';
        this.scrollToBottom();
    }

    endChat(){
        if(this.chatRoom!.adminId == null){
            this.chatService.endChat(this.loggedUser!);
        }else {
            const chatMessageReq = {
                chatRoomId: this.chatRoom!.id,
                senderId: this.loggedUser!.id,
                receiverId: this.adminUser!.id,
                message: 'End chat',
                type: ChatMessageTypeEnum.END
            }
            this.chatService.sendMessage(chatMessageReq);
        }
        this.chatRoom!.active = false;
        this.chatRoom!.adminId = null;
        this.isAdminActive = false;

    }

    userRead(){
        this.chatRoom!.userRead = true;
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

    getChatMessageHistory(){
        debugger
        this.isLoaded = true;
        setTimeout(() => {
            this.chatService.getChatMessagesHistory(this.chatRoom!.id, this.chatMessageQuery).subscribe({
                next: (response) => {
                    for (let chatMessage of response.content) {
                        this.chatMessages.unshift(chatMessage);
                    }
                    this.chatMessageQuery.page++;
                    this.chatHistoryLoaded$.next();
                    this.isLoaded = false;
                },
                error: (error) => {
                    this.toastr.error('Failed to get chat messages: ' + error.message);
                }
            });
        }, 500);
    }

    onScroll(event: any) {
        const scrollTop = event.target.scrollTop;
        if(scrollTop == 0){
            this.getChatMessageHistory();
        }
    }

    protected readonly ChatMessageTypeEnum = ChatMessageTypeEnum;
}
