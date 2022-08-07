import {EventEmitter} from 'events';
import DiscordMessage from './DiscordMessage';
import { messagesLimit } from './configs.json';

export default class Channel {

    static events: EventEmitter = new EventEmitter();

    private messages: DiscordMessage[] = []

    constructor(
        public id: number,
        public name: string = `RandomChannel#${id}`
    ) {
    }

    getMessages(): DiscordMessage[] {
        return this.messages;
    }

    addMessage(message: DiscordMessage) {
        if (this.messages.length >= messagesLimit) {
            this.messages = this.messages.slice(1, 24);
        }
        this.messages.push(message);
        Channel.events.emit('message_update', this.id)
    }
}
