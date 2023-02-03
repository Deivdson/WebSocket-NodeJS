const WebSocket = require('ws');

var perguntas = []
var lista = []

class Pergunta{
    constructor(perg, resp){
        this.perg=perg;
        this.resp=resp;
    }
    comp(resposta){
        if(resposta==this.resp){
            return true;
        }else{
            return false;
        }
    }
}

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}


function onMessage(ws, data) {
    var msg = String(data).split('-');
    console.log(`onMessage: ${msg}`);
    console.log(`onMessage2: ${data}`);
    console.log(`onMessage2: ${msg[1]}`);
    // ws.send(`recebido!`);

    var i = -1
    if(msg[0] == 'pergunta'){
           
        ws.send(`pergunta!`);
        let nova_pergunta = new Pergunta(String(msg[1]), String(msg[2]));
        perguntas.push(nova_pergunta)
        i = perguntas.indexOf(nova_pergunta)
        lista.push(`${String(msg[1])}-${String(msg[2])}-`)
        console.log("Lista de perguntas");
        console.log(perguntas);
        console.log(perguntas.indexOf(nova_pergunta))        
        
        console.log(lista)
        

        // objetoJSON = {tipo: "pergunta", id:i, perg:msg.perg}        String(msg[1])
        ws.send(`Teste`);        

        console.log(`pergunta-${i}-${perguntas[i].perg}`)
    }
    else if(msg[0]=='resposta'){
        ws.send(`Resposta!`);
        if(perguntas.length!=0){
            perg = perguntas[msg[1]];
            let retorno = perg.comp(msg[2]);
            if(retorno == true){
                ws.send(`resposta Correto!`);
            }else{
                ws.send(`resposta Incorreta.`);
            }
        }else{
            ws.send("Nenhuma Pergunta foi cadastrada.")
        }
        
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