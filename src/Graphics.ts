import * as blessed from "blessed"

let screen = blessed.screen({
    smartCSR: true
});

screen.title = 'HentCord';


//todo сменить тип на список
//Левый бордер со списком игроков

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
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
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
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
});

screen.append(header);
screen.append(text);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

export let updateMessages = (messages : string[])=>{
    messages.forEach(m=>text.pushLine(m))
    while(text.getLines().length>(parseInt(""+text.height)-2)){
        text.deleteTop();
    }
    screen.render();
}

export let updateHeader = (headermsg : string)=>{
    header.content = headermsg;
    screen.render();
}

screen.render();
