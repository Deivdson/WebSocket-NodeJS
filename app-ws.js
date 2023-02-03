const WebSocket = require('ws');

var perguntas = []
var lista = []

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}


function onMessage(ws, data) {
    var msg = String(data).split('-');
    console.log(`onMessage: ${msg}`);
   

    var i = -1
    if(msg[0] == 'pergunta'){
        
        lista.push(`${String(msg[1])}-${String(msg[2])}-`)
        console.log("Lista de perguntas");
        console.log(perguntas);    
        
        console.log(lista)
    }
    jsonobj =  JSON.stringify(lista);
    console.log(jsonobj);
    ws.send(jsonobj);
    
    
}

function onConnection(ws, req) {
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    console.log(`onConnection`);
}

module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });

    wss.on('connection', onConnection);

    console.log(`App Web Socket Server is running!`);
    return wss;
}