/**
 * @name terminal-discord-writer-bd
 * @version 0.1
 * @author nekonya
 */

let active = true;

let confirmedChannels = []
let confirmedServers = []

let lastID = 0;

module.exports = class NekoNya {
    getName() {
        return 'terminal-discord-writer-bd';
    }

    getVersion() {
        return '0.1 neko-alpha';
    }

    getAuthor() {
        return 'nekonya';
    }

    getDescription() {
        return 'Подключаемся однако.';
    }

    load() {

    }

    start() {
        console.log(this.getName())
        this.ChannelStore = ZeresPluginLibrary.WebpackModules.getByProps('getChannel', 'getDMFromUserId');
        this.GuildStore = ZeresPluginLibrary.WebpackModules.getByProps('getGuild')
        ZeresPluginLibrary.WebpackModules.find(e => e.dispatch && !e.getCurrentUser),
            'dispatch',
            (_, args, original) => this.onDispatchEvent(args, original)
        this.Patcher = XenoLib.createSmartPatcher({
            before: (moduleToPatch, functionName, callback, options = {}) => ZeresPluginLibrary.Patcher.before(this.getName(), moduleToPatch, functionName, callback, options),
            instead: (moduleToPatch, functionName, callback, options = {}) => ZeresPluginLibrary.Patcher.instead(this.getName(), moduleToPatch, functionName, callback, options),
            after: (moduleToPatch, functionName, callback, options = {}) => ZeresPluginLibrary.Patcher.after(this.getName(), moduleToPatch, functionName, callback, options)
        });
        this.unpatches = [];
        this.unpatches.push(
            this.Patcher.instead(
                ZeresPluginLibrary.WebpackModules.find(e => e.dispatch && !e.getCurrentUser),
                'dispatch',
                (_, args, original) => this.onDispatchEvent(args, original)
            )
        );

    }

    onDispatchEvent(args, callDefault) {
        const dispatch = args[0];
        if (active && dispatch.type === 'MESSAGE_CREATE' && dispatch.message) {
            this.sendMessage(dispatch.message.channel_id, this.ChannelStore.getChannel(dispatch.message.channel_id).guild_id, dispatch.message.id, dispatch.message.author.username, dispatch.message.content)
        }
    }

    sendMessage(channelId, serverId, msgId, author, text) {
        if(lastID === msgId){
            return
        }else{
            lastID = msgId
        }
        if (!confirmedChannels.find(e => e === channelId)) {
            this.confirmChannel(this.ChannelStore.getChannel(channelId).name,channelId,serverId)
            confirmedChannels.push(channelId)
        }
        if (!confirmedServers.find(e => e === serverId)) {
            this.confirmServer(this.GuildStore.getGuild(serverId).name,serverId);
            confirmedServers.push(serverId);
        }
        let mcp = {
            channelID: parseInt(channelId),
            serverID: parseInt(serverId),
            msgInChatID: parseInt(msgId),
            authorname: author,
            messageText: text
        }
        console.log(mcp)
        this.post("message",mcp)
    }

    confirmChannel(name, channelId, serverId) {
        this.post("channel",{
            channelID: parseInt(channelId),
            serverID: parseInt(serverId),
            name: name
        })
    }

    confirmServer(name,serverId) {
        this.post("server",{
            serverID: parseInt(serverId),
            name: name
        })
    }

    post(route, obj) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/"+route);

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = () => console.log(xhr.responseText);

        xhr.send(JSON.stringify(obj));
    }

    stop() {
        try {
            active = false;
            this.shutdown();
        } catch (err) {
            ZeresPluginLibrary.Logger.stacktrace(this.getName(), 'Failed to stop!', err);
        }
    }

    shutdown() {
        ZeresPluginLibrary.Patcher.unpatchAll(this.getName());
    }
}
