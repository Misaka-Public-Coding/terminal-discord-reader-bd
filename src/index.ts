import express from 'express';
import DiscordMessage from './DiscordMessage';
import ChannelUpdate from "./ChannelUpdate";
import ServerUpdate from "./ServerUpdate";
import ServerController from "./ServerController";
import {port} from './configs.json';
import * as PGUI from './Graphics';
import {EventEmitter} from "events";

const app = express();

export const events: EventEmitter = new EventEmitter();

// let currentChannelId = 0;

app.use(express.json());

app.post('/message', (req, res) => {
    const message = req.body as DiscordMessage;
    ServerController.preAdd(message)
    res.sendStatus(200);
});

app.post('/channel', (req, res) => {
    const message = req.body as ChannelUpdate;
    ServerController.updateChannelName(message.name,message.channelID,message.serverID)

    res.sendStatus(200);
});

app.post('/server', (req, res) => {
    const message = req.body as ServerUpdate;
    ServerController.updateServerName(message.name,message.serverID);
    res.sendStatus(200);
});

app.get('/console',(req,res)=>{
    res.json(ServerController.getServers());
});

app.listen(port, () => {
    console.log(`> Server is listening on port ${port}`);
});

events.on("message_update",(cid,sid)=>{
        let s = ServerController.getServerByID(sid)
        if(s){
            let c = s.getChannelByID(cid);
            if(c){
                PGUI.updateHeader(s.name+'<||>'+c.name);
                PGUI.updateMessages(c.getMessagesRaw());
            }else{return;}
        }else{
            return;
        }
})
