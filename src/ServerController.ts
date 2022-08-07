import DiscordMessage from "./DiscordMessage";
import Server from "./Server";

export default class ServerController{
    private static servers: Server[] = []

    static getServers() {
        return this.servers;
    }

    static updateServerName(name: string, id: number) {
        for (const server of this.servers) {
            if (server.id === id) {
                server.name = name;
                return;
            }
        }
        this.addServer(new Server(id,name));
    }

    static updateChannelName(name: string, id: number, sid: number) {
        for(const server of this.servers){
            if (server.id === sid) {
                server.updateChannelName(name,id)
                return;
            }

        }
        this.addServer(new Server(sid));
    }

    static addServer(server: Server) {
        this.servers.push(server);
    }

    static getServerByID(id: number) {
        return this.servers.find((s) => s.id === id);
    }

    static preAdd(message: DiscordMessage) {
        for (const server of this.servers) {
            if (server.id === message.serverID) {
                server.preAdd(message)
                return;
            }
        }
        this.addServer(new Server(message.serverID))
        this.preAdd(message)
    }
}
