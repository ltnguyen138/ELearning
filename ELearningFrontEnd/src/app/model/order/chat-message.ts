import { ChatRoom } from "../chat-room";
import {User} from "../user";

export interface ChatMessage{

    id: number;
    chatRoom: ChatRoom;
    sender: User;
    receiver: User;
    message: string;
    timestamp: Date;
    type: string;
}