export class ChatMessageReq{

    chatRoomId: number;
    senderId: number;
    receiverId: number;
    message: string;
    type: string;

    constructor(chatRoomId: number, senderId: number, receiverId: number, message: string, type: string){
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.type = type;
    }
}