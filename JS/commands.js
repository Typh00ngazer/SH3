connectedIP = document.getElementById("connectedIP");
termarea = document.getElementById("termarea");
notifyArea = document.getElementById("notify");
BrowserArea = document.getElementById("BrowserArea");

function submit(e, textarea) {
  if (e.keyCode === 13) {
    let termarea = document.getElementById("termarea");
    let commandOutput = document.getElementById("command-output");
  
    if (termarea.value.trim() != "") {
      let command = termarea.value.trim();
      commandOutput.innerHTML += "<span style='color:#cc0000'>┌─[</span><span style='color:#00ff00'>"+username+"</span><span style='color:#f5dd3d'>@</span><span style='color:#34e2e2'>nooB</span><span style='color:#cc0000'>]─[</span><span style='color:#00ff00'>"+ connectedIP.innerHTML +"</span><span style='color:#cc0000'>]<br>└──╼ </span><span style='color:#f5dd3d'>$</span> " + command + "<br><br>";
      termarea.value = "";
      textarea.scrollIntoView();
      if (command.startsWith("connect")) {
        if (connectedIP.innerHTML != command.replace("connect", "").trim()) {
          remotelog.innerHTML = "";
          makeRequest('php/commands.php', command);
        } else {
          commandOutput.innerHTML += "You are already connected to that ip<br><br>";
        }
      } else if (command.startsWith("clear")) {
        commandOutput.innerHTML = "";
      } else if (command.startsWith("bye") || command.startsWith("exit") || command.startsWith("leave")) {
        if (connectedIP.innerHTML != "~") {
          connectedIP.innerHTML = "~";
          remotelog.innerHTML = "";
          makeRequest('php/commands.php', "bye");
          commandOutput.innerHTML += "Disestablished connection from host<br><br>";
        } else {
          commandOutput.innerHTML += "You are currently not connected to anyone<br><br>";
        }
      } else if (command.startsWith("ls") || command.startsWith("list")) {
        //make local ls
        if (connectedIP.innerHTML != "~") {
          makeRequest('php/commands.php', "ls " + connectedIP.innerHTML);
        } else {
          makeRequest('php/commands.php', "ls");
        }
      } else if (command.startsWith("rm") || command.startsWith("remove") || command.startsWith("delete")) {
        //make local rm
        makeRequest('php/commands.php', command);
      } else if (command.startsWith("ul") || command.startsWith("upload")) {
        makeRequest('php/commands.php', command);
      } else if (command.startsWith("dl") || command.startsWith("download")) {
        makeRequest('php/commands.php', command);
      } else if (command.startsWith("whois")) {
        makeRequest('php/commands.php', command);
      } else if (command.startsWith("gen npc")) {
        makeRequest('php/commands.php', command);
      } else if (command.startsWith("recovery")) {
        makeRequest('php/commands.php', 'recovery');
      } else if (command.startsWith("notify")) {
        command = command.split(",");
        lifespan = parseInt(command[1]);
        type = command[2];
        message = command[3];
        notify(lifespan, type, message);
      }
    }
  }
}
  
function makeRequest(url, command) {
  httpRequest.onreadystatechange = alertContents;
  httpRequest.open('POST', url);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('command=' + encodeURIComponent(command));
}

function alertContents() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      console.log(httpRequest.responseText);
      var response = JSON.parse(httpRequest.responseText);
      let commandOutput = document.getElementById("command-output");
      if (response.command === "connect") {
        if (response.valid === "yes") {
          var connTo = response.ip;
          commandOutput.innerHTML += response.access;
          connectedIP.innerHTML = connTo;
          connect(currentIP, connTo);
        } else {
          commandOutput.innerHTML += response.access;
        }
      } else if (response.command === "ls") {
        var currentFiles = response.files;
        var list = "";
        for (i = 0; i < currentFiles.length; i++) {
          list += "<tr><td>" + currentFiles[i]['id'] + "</td><td>" + currentFiles[i]['name'] + "</td><td>v" + currentFiles[i]['level'] + "</td><td>" + currentFiles[i]['size'] + " GB</td><td>" + currentFiles[i]['type'] + "</td></tr>";
        }
        //console.log(commandOutput.innerHTML += "<table  width='100%'><tr><th>#</th><th>Name</th><th>Version</th><th>Size</th><th>Type</th></tr><div id='file-output'>" + list + "</div></table><br>");
      } else if (response.command === "rm") {
        commandOutput.innerHTML += response.fileExist + "<br><br>";
      } else if (response.command === "ul") {
        commandOutput.innerHTML += response.upload + "<br><br>";
      } else if (response.command === "dl") {
        commandOutput.innerHTML += response.download + "<br><br>";
      } else if (response.command === "whois") {
        commandOutput.innerHTML += response.whois + "<br><br>";
      } else if (response.command === "gen npc") {
        commandOutput.innerHTML += response.npc + "<br><br>";
      } else if (response.command === "recovery") {
        commandOutput.innerHTML += response.recovery + "<br><br>";
      } else if (response.command === "blackmarket") {
        Selling = response.selling
        list = "";
        for (i = 0; i < Selling.length; i += 3) {
          list += "<tr><td>" + Selling[i] + "</td><td>" + Selling[i+1] + "btc</td><td>" + Selling[i+2] + "</td><td style='width:30%;'><input type='number' min='0' max='" + Selling[i+2] + "' id='Buy=" + Selling[i] + "' style='overflow: hidden; width:40%;' wrap='off' rows='1' onkeypress='buy(event, this)'></input></td></tr>";
        }
        BrowserArea.innerHTML += "<table  id=MarketSell width='100%' style='color:white; padding-left:10px; padding-top:5px;'><tr><th>Name</th><th>Price</th><th>Avaliable</th><th>Buy</th></tr>" + list
      } else if (response.command === "buy") {
        if (response.success === "yes") {
          console.log("Bought " + response.amount + " " + response.name);
          reload();
        } else {
          console.log("Failed to buy " + response.amount + " " + response.name);
        }
        console.log(response.error);
      } else if (response.command === "ResetIP") {
        var currentIP = response.currentIP;
        header = document.getElementById("TermTitle");
        header.innerHTML = "<b>WebTerminal - " + currentIP + "</b>";
      } else if (response.command === "Finances") {
        if (response.success === "yes") {
          table = document.getElementById("accountTable");
          moneyTotal = document.getElementById("moneyTotal");
          table.innerHTML = "";
          moneyTotal.innerHTML = 0;
          var row0 = table.insertRow(0);
          row0.insertCell(0).innerHTML = "<div style='text-align:center; font-weight:bold; font-size:100%;'>Account</div>";
          row0.insertCell(1).innerHTML = "<div style='text-align:center; font-weight:bold; font-size:100%;'>Total</div>"; 
          r = 1;
          for (i = 0; i < response.accounts.length; i += 3) {
            var row = table.insertRow(r);
            addr = response.accounts[i];
            amount = response.accounts[i+1];
            bankIP = response.accounts[i+2];

            row.insertCell(0).innerHTML = "<div style='padding-top:4px; color:red; cursor:pointer; font-size:80%;' onclick='Click2View(this, " + addr + ")'>[Click To View]</div><div style='color:yellow; padding-top:4px; font-size:80%;'><u>" + bankIP + "</u></div>";
            row.insertCell(1).innerHTML = "<div style='color:green;'>$"+amount+"</div>";
            r++

            moneyTotal.innerHTML =  Number(moneyTotal.innerHTML) + Number(amount); 
          }
          moneyTotal.innerHTML = "$" + moneyTotal.innerHTML;
        } else {
          console.log("Failed to load: " + response.error);
        }
      } else if (response.command === "list") {
        NPCs = document.getElementById("NPCList");
        Players = document.getElementById("PlayerList");//cells [ icons | ip | name | cpu | notes ]
        NPCs.innerHTML = "";
        Players.innerHTML = "";
        console.log(response.npcs[1]);

        //cells [ icons | ip | name | cpu | notes ]
        var tbl = document.createElement('table');
        tbl.style.width = '100%';
        var tbdy = document.createElement('tbody');
        for (var i = 0; i < response.npcs.length; i += 3) {
          var tr = document.createElement('tr');
          for (var j = 0; j < 2; j++) {
            if (i == 2 && j == 1) {
              break
            } else {
              var cell = document.createElement('td');
              var cellText = document.createTextNode()
              cell.appendChild(cellText)
              tr.appendChild(td)
            }
          }
          tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy);
        NPCs.appendChild(tbl)
        // for (i = 0; i < response.npcs.length; i += 3) {
        //   Name = response.npcs[i];
        //   ip = response.npcs[i+1];
        //   cpu = response.npcs[i+2];

        //   NPCs.innerHTML += "<p style='color:gray;'><u style='color:orange;'>" + ip + "</u><br>" + Name + " - " + cpu + "MHz</p>";
        // }
        
        for (i = 0; i < response.players.length; i += 3) {
          Name = response.players[i];
          ip = response.players[i+1];

          Players.innerHTML += "<p>" + Name + "</p>";
        }
      }
    } else {
      alert('There was a problem with the request.');
    }
    termarea.scrollIntoView();
  }
}

function resetIP() {
  makeRequest('php/resetIP.php', "ResetIP");
}

function notify(lifespan, type, message) {
  if (type === "alert") {
    typeClass = '<li class="alert"';
  } else if (type === "success") {
    typeClass = '<li class="alert success"';
  } else if (type === "info") {
    typeClass = '<li class="alert infor"';
  } else if (type === "warning") {
    typeClass = '<li class="alert warning"';
  }
  notifyid = String(Math.random()).substring(2);
  barid = String(Math.random()).substring(2);
  notifyArea.innerHTML += typeClass + ' id='+ notifyid + ' onclick="this.remove();"><span class="closebtn">&times;</span><b>' + type + '!</b><br> ' + '<div id="myProgress"><div id=' + barid + ' style="width: 10%;height: 30px;background-color: #4CAF50;text-align: center;line-height: 30px;color: white;">0%</div></div>' + message + '</li>';
  closeNotify(notifyid, barid);
  function closeNotify(notifyid, barid) {
    frame(barid, 0, 0, lifespan);
    setTimeout(function() {
      try {
        document.getElementById(notifyid).remove();
      } catch (e) {
        //sends a error if notification does not exist just pass
      }
    }, lifespan);

    function frame(barid, width, i, lifespan) {
      elem = document.getElementById(barid);
      if (elem != null) {
        //console.log(barid, width, i, lifespan);
        if (width >= 100) {
          //pass
        } else {
          width++;
          elem.style.width = width + "%";
          i = i + lifespan/100000;
          elem.innerHTML = (lifespan/1000 - i).toFixed(1) + "s";
          setTimeout(function() {
            frame(barid, width, i, lifespan);
          }, lifespan/100);
        }
      }
    }
  }
}

function reload() {
  if(document.getElementById('MarketSell')) {
    BrowserArea.innerHTML = "<style> #BrowserArea {background-color: black;} </style><textarea id='searchbar' style='overflow: hidden;' spellcheck='false' rows='1' onkeypress='search(event, this)' wrap='off'></textarea>"
    makeRequest('php/commands.php', "blackmarket");
  } else {
    BrowserArea.innerHTML = "<style> #BrowserArea {background-color: black;} </style><textarea id='searchbar' style='overflow: hidden;' spellcheck='false' rows='1' onkeypress='search(event, this)' wrap='off'></textarea>"
  }
}

function search(e, searchbar) {
  if (e.keyCode === 13) {
    e.preventDefault();
    searchbar = searchbar.value;
    BrowserArea.innerHTML = "<style> #BrowserArea {background-color: black;} </style><textarea id='searchbar' style='overflow: hidden;' spellcheck='false' rows='1' onkeypress='search(event, this)' wrap='off'></textarea>"
    if (searchbar.trim() != "") {
      if (searchbar.trim() == "elite") {
        BrowserArea += "<link href='css/Bpage.css' rel='stylesheet' type='text/css'><p>hi</p>"
      } else if (searchbar.trim() == "market") {
        makeRequest('php/commands.php', "blackmarket");
      }
    }
  }
  searchbar = "";
}

function buy(e, buy) {
  if (e.keyCode === 13) {
    e.preventDefault();
    Name = buy.id
    buy = buy.value;
    if (buy.trim() != "") {
      makeRequest('php/commands.php', Name + "," + buy);
    }
  }
  buy = "";
}

function Click2View(self, addr) {
  self.innerHTML = addr;
}

function BTC(option) {
  if (option == "redeem") {
    document.getElementById("OptionArea").innerHTML = "<form onsubmit='redeem(input.value);return false;'>"
	+ "<input id='input' style='width: 90%'' type='text' placeholder='Enter a BTC Packet'>"
    + "<input type='submit' style='width: 95%' value='Consume Packet'></form>"

  } else if (option == "create") {
    document.getElementById("OptionArea").innerHTML = "<form onsubmit='create(coinputde.value);return false;'>"
	+ "<input id='input' style='width: 90%' type='text' placeholder='How much BTC?'>"
    + "<input type='submit' style='width: 95%' value='Create Packet'></form>"
  } else if (option == "buy") {
    document.getElementById("OptionArea").innerHTML = "<form onsubmit='BTCBuy(input.value);return false;'>"
	+ "<input id='input' style='width: 90%' type='text' placeholder='How much BTC?'>"
    + "<input type='submit' style='width: 95%' value='Buy BTC'></form>"
  } else if (option == "sell") {
    document.getElementById("OptionArea").innerHTML = "<form onsubmit='BTCSell(input.value);return false;'>"
	+ "<input id='input' style='width: 90%' type='text' placeholder='How much BTC?'>"
    + "<input type='submit' style='width: 95%' value='Sell BTC'></form>"
  }
}

function Finances() {
  makeRequest('php/commands.php', "Finances");
}

function ListPlayers() {
  makeRequest('php/commands.php', "list");
}
