import {ChatMessage} from "../../model/order/chat-message";

export  class ChatMessageQuery{

    constructor(
        public page: number=1,
        public size: number=10,
        public sort: string="timestamp,desc",
    ) {
    }

    get queryParams() {
        const params: any = {
            page: this.page,
            size: this.size,
            sort: this.sort
        };

        return params;
    }
}

