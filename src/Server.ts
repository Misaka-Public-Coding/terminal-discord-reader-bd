import DiscordMessage from './DiscordMessage';
import Channel from './channel';

export default class Server {

    private channels: Channel[] = []

    constructor(
        public id: number,
        public name: string = `RandomServer#${id}`
    ) {
    }

    getChannels(): Channel[] {
        return this.channels;
    }

    updateChannelName(name: string, id: number) {
        for (const channel of this.channels) {
            if (channel.id === id) {
                channel.name = name;
                return;
            }
        }
        this.addChannel(new Channel(id,name));
    }

    addChannel(channel: Channel) {
        this.channels.push(channel);
    }

    getServerByID(id: number) {
        return this.channels.find((c) => c.id === id);
    }

    preAdd(message: DiscordMessage) {
        for (const channel of this.channels) {
            if (channel.id === message.channelID) {
                channel.addMessage(message);
                return
            }
        }
        this.addChannel(new Channel(message.channelID))
        this.preAdd(message)
    }
}
