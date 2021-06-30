const WebSocket = require('ws');
fs = require('fs');
const wss = new WebSocket.Server({ port: 8080 });
 
wss.on('connection', ws => {
  //ws.id = String(Math.random()).substring(2)
  ws.onmessage = function(event) {
    //console.log(ws.id);
    var message = JSON.parse(event.data);
    switch(message.type) {
      case "message":
        //ws.send(message.name);
        var ChatMessage = {
          type: "ChatMessage",
          text: message.name + ": " + message.text.trim().replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;"),
          id:   String(Math.random()).substring(2),
          date: new Date().toLocaleTimeString()
        };
        wss.clients.forEach(client => client.send(JSON.stringify(ChatMessage)));
        // fileName =  'chat ' + new Date().toLocaleString().split(',')[0].replace(/\//g, "-") + '.txt';
        // fs.writeFile(fileName, ChatMessage.text+"\n",  {'flag':'a+'},  function(err) {
        //   if (err) {return console.error(err); }
        // });
        break;
      case "updateLogs":
        var UpdateLogs = {
          type: "UpdateLogs",
          attackerIP: message.attackerIP,
          defenderIP: message.defenderIP
        };
        wss.clients.forEach(client => client.send(JSON.stringify(UpdateLogs)));
        break;
    }
  }
})