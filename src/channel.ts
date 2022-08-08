import DiscordMessage from './DiscordMessage';
import { messagesLimit } from './configs.json';
import {events} from "./index";
import {message} from "blessed";

export default class Channel {
    private messages: DiscordMessage[] = []

    constructor(
        public id: number,
        public name: string = `RandomChannel#${id}`
    ) {
    }

    getMessages(): DiscordMessage[] {
        return this.messages;
    }

    getMessagesRaw(): string[]{
        const rtn:string[] = []
        this.getMessages().forEach(message=>{
            rtn.push(message.authorname+'|>|'+message.messageText)
        })
        return rtn;
    }

    addMessage(message: DiscordMessage) {
        if (this.messages.length >= messagesLimit) {
            this.messages = this.messages.slice(1, 15);
        }
        this.messages.push(message);
        events.emit('message_update', message.channelID, message.serverID)
    }
}
