import * as blessed from "blessed"
import {events, lastServerId} from "./index";
import ServerController from "./ServerController";

let screen = blessed.screen({
    smartCSR: true
});

screen.title = 'Discord I guess';

let header = blessed.text({
    top: "1%",
    left: '0%',
    width: '100%',
    height: '20%',
    content: 'RandomServer#1 |<>| RandomChannel#1',
    tags: true,
    align: "center",
    border: {
        type: 'line'
    }
});

//коробка с сообщениями
let text = blessed.text({
    top: "21%",
    left: '0%',
    width: '100%',
    height: '85%',
    tags: true,
    border: {
        type: 'line'
    }
});

let selectChannels = blessed.list({
    hidden: true,
    keys: true,
    style: {
        selected: {
            fg: 'white',
            bg: 'black',
        }
    },
    top: "21%",
    left: '0%',
    width: '100%',
    height: '85%',
    border: {
        type: 'line'
    },
})

let selectServers = blessed.list({
    hidden: true,
    keys: true,
    style: {
        selected: {
            fg: 'white',
            bg: 'black',
        }
    },
    top: "21%",
    left: '0%',
    width: '100%',
    height: '85%',
    border: {
        type: 'line'
    },
})

screen.append(header);
screen.append(text);
screen.append(selectChannels);
screen.append(selectServers);

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});



screen.key('c', () => {
    updateChannels(lastServerId)
})

screen.key('s', () => {
    updateServer();
})

let serversLast : number[] = []
let updateServer = () => {
    text.hide()
    serversLast = []
    selectServers.clearItems()
    selectChannels.hide();
    ServerController.getServers().forEach(s=>{
        serversLast.push(s.id)
        selectServers.addItem(s.name)
    })
    selectServers.show()
    screen.render()
    selectServers.focus()
}

let lastSID = 0
selectServers.on("select", (item, index) => {
    lastSID = serversLast[index];
    updateChannels(serversLast[index]);
})

let channelsLast : number[] = []
let updateChannels = (id: number) => {
    //todo подгруз каналов

    channelsLast = []
    selectChannels.clearItems()
    text.hide()
    selectServers.hide();
    let c = ServerController.getServerByID(id);
    if(!c){
        text.show()
        screen.render()
        return;
    }
    c.getChannels().forEach(c=>{
        channelsLast.push(c.id)
        selectChannels.addItem(c.name)
    })

    selectChannels.show()
    screen.render()
    selectChannels.focus()
}

selectChannels.on("select", (item, index) => {
    events.emit("changeChannel",lastSID,channelsLast[index])
    selectChannels.hide()
    text.show()
    screen.render();
})


export let updateMessages = (messages: string[]) => {
    while (text.getLines().length > 0) {
        text.deleteTop();
    }

    messages.forEach(m => text.pushLine(m))
    while (text.getLines().length > (parseInt("" + text.height) - 2)) {
        text.deleteTop();
    }

    while (text.getScreenLines().length > (parseInt("" + text.height) - 2)) {
        text.deleteTop();
    }
    screen.render();
}

export let updateHeader = (headermsg: string) => {
    header.content = headermsg;
    screen.render();
}

screen.render();
