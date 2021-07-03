const socket = new WebSocket('ws://localhost:8080');
remotelog = document.getElementById("logs-remote");
locallog = document.getElementById("logs-local");
BrowserArea = document.getElementById("BrowserArea");

socket.onopen = () => {
  console.log('connection established');
}

socket.onclose = () => {
  makeRequest('php/commands.php', "bye");
}

socket.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
}
 
socket.onmessage = (e) => {
  var message = JSON.parse(e.data);
  switch(message.type) {
    case "ChatMessage":
      chat = document.getElementById("user-messages");
      chat.innerHTML = chat.innerHTML + "<li><div id=" + message.id + ">" + message.text + "</div></li>";
      chat.scrollTo(0, chat.scrollHeight);
      let liList = document.getElementsByTagName("li");
      let ListLen = liList.length;
      while (ListLen > 49){
        liList[0].remove();
        ListLen = liList.length;
      }
      break;
    case "UpdateLogs":
      IPs = [message.attackerIP, message.defenderIP];
      if (IPs[0] === currentIP) {
        //make local log for attacker
        //grab remote logs of the ip your connected to
        logsRequest('php/logs.php', IPs[1]+","+currentIP);
      } else if (IPs[1] === currentIP) {
        //make local auth log for defender
        logsRequest('php/logs.php', "0,"+currentIP);
      } else {
        IPs = undefined;
      }
    case "search":
      BrowserArea.innerHTML = message.html;
      break;
  }
  //console.log(message);
}

const sendChat = (e, textarea, username, id) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    if (textarea.value.trim() != "") {
      var msg = {
        type: "message",
        name: username,
        text: textarea.value.trim(),
        id:   id,
        date: Date.now()
      };
      socket.send(JSON.stringify(msg));
      textarea.value = "";
    }
  }
}

function connect(ip1, ip2) {
  var msg = {
    type: "updateLogs",
    attackerIP: ip1,
    defenderIP: ip2
  };
  socket.send(JSON.stringify(msg));
}

function logsRequest(url, command) {
  remotelog.innerHTML = "";
  locallog.innerHTML = "";
  httpRequest.onreadystatechange = alertLogs;
  httpRequest.open('POST', url);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('command=' + encodeURIComponent(command));
}

function alertLogs() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      //console.log(httpRequest.responseText);
      var response = JSON.parse(httpRequest.responseText);
      if (response.rANDl === "true") {
        makeLog = response.logsL;
        makeLog1 = response.logsR;
        logTO = locallog;
        x=1
      } else if (response.rANDl === "false") {
        makeLog = response.logs;
        logTO = locallog;
        x=2
      }
      for (;x<=2;x++) {
        for (i in makeLog) {
          //id, logType, info, LoggedIP, ipTo, currentDate
          id = JSON.stringify(makeLog[i].id).replace(/"/g, "");
          logType = JSON.stringify(makeLog[i].logType).replace(/"/g, "");
          info = JSON.stringify(makeLog[i].info).replace(/"/g, "");
          LoggedIP = JSON.stringify(makeLog[i].LoggedIP).replace(/"/g, "");
          currentDate = JSON.stringify(makeLog[i].currentDate.replace(/"/g, ""));
          
          postLog = "<div id=" + id + " class='info'>" + info + "</div> \
                    <div id=" + id + " class='ip' style='color:orange;'><u>" + LoggedIP + "</u></div> \
                    <div id=" + id + " class='date'>" + currentDate.replace(/"/g, "") + "</div>"
          logTO.innerHTML = postLog + logTO.innerHTML;
        }
        if (typeof makeLog1 != 'undefined') {
          makeLog = makeLog1;
          logTO = remotelog;
        }
      }
    }
  }
}