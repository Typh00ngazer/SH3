connectedIP = document.getElementById("connectedIP");
termarea = document.getElementById("termarea");
notifyArea = document.getElementById("notify");
BrowserArea = document.getElementById("BrowserArea");
chatArea = document.getElementById("user-messages");

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
      } else if (command.startsWith("help")) {
        commandOutput.innerHTML = "The commands are: [connect, bye, ls, (ul, dl, rm) or (ulid, dlid, rmid), whois [name or ip], gen npc [name], recovery, notify [lifespan (in ms), type (alert, success, info, warning), message]]";
      }
    }
  }
}
  
function makeRequest(url, command) {
  httpRequest = new XMLHttpRequest();
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
        currentFiles = response.files
        if (response.files == "None") {
          commandOutput.innerHTML += "No files have been found<br><br>";
        } else {
          var tbl = document.createElement('table');
          tbl.style.width = '100%';
          var tbdy = document.createElement('tbody');
          var row = tbl.insertRow(0);
          row.insertCell(0).innerHTML = "<div style='text-align:center; font-weight:bold; font-size:100%;'>ID</div>";
          row.insertCell(1).innerHTML = "<div style='text-align:center; font-weight:bold; font-size:100%;'>Name</div>";
          row.insertCell(2).innerHTML = "<div style='text-align:center; font-weight:bold; font-size:100%;'>Level</div>"; 
          row.insertCell(3).innerHTML = "<div style='text-align:center; font-weight:bold; font-size:100%;'>Size</div>"; 
          row.insertCell(4).innerHTML = "<div style='text-align:center; font-weight:bold; font-size:100%;'>Type</div>"; 
          for (var i = 0; i < response.files.length; i++) {
            var row = tbl.insertRow(i+1);
            row.insertCell(0).innerHTML = "<div style='text-align:center;'>" + currentFiles[i]['id'] + "</div>";
            row.insertCell(1).innerHTML = "<div style='text-align:center;'>" + currentFiles[i]['name'] + "</div>";
            row.insertCell(2).innerHTML = "<div style='text-align:center;'>v" + currentFiles[i]['level'] + "</div>";
            row.insertCell(3).innerHTML = "<div style='text-align:center;'>" + currentFiles[i]['size'] + "GB</div>";
            row.insertCell(4).innerHTML = "<div style='text-align:center;'>" + currentFiles[i]['type'] + "</div>";
          }
          commandOutput.appendChild(tbl);
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
        Players = document.getElementById("PlayerList");
        NPCs.innerHTML = "";
        Players.innerHTML = "";

        var tbl = document.createElement('table');
        tbl.style.width = '100%';
        var tbdy = document.createElement('tbody');
        for (var i = 0; i < response.npcs.length; i += 3) {
          Name = response.npcs[i];
          ip = response.npcs[i+1];
          cpu = response.npcs[i+2];
          var tr = document.createElement('tr');
          for (var j = 0; j < 5; j++) {
            var cell = document.createElement('td');
            if (j == 0){
              var cellText = '<img src="Pictures/ddos.png" width="15px" onclick="nothing()"></img>';
            } else if (j == 1) {
              var cellText = "<u style='color:orange;'>" + ip + "</u>";
            } else if (j == 2) {
              var cellText = "<p style='color:gray;'>" + Name + "</p>";
            } else if (j == 3) {
              var cellText = cpu + "MHz";
            } else if (j == 4) {
              var cellText = "<textarea rows='1'></textarea>";
            }
            cell.innerHTML = cellText;
            tr.appendChild(cell);
          }
          tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy);
        NPCs.appendChild(tbl)
        
        for (i = 0; i < response.players.length; i++) {
          Name = response.players[i];
          ip = response.players[i+1];

          Players.innerHTML += "<p>" + Name + "</p>";
        }
      } else if (response.command === "stats" || response.command === "stat") {
        gateright = document.getElementById("Gateright");
        if (response.command === "stats") {
          gateright.innerHTML = "Rank: " + response.stats[0] + "<br>Rep: " + response.stats[1] + "<br>Cpu: " + response.stats[2] + " MHz<br>Network: " + response.stats[3] + " Mbps<br>Hard Drive: " + response.stats[4] + "GB<br>External Drive: " + response.stats[5] + "GB";
        } else {
          if (response.name === "cpu") {
            reName = "Cpu: "
            reEnd = " MHz"
          } else if (response.name === "network") {
            reName = "Network: "
            reEnd = " Mbps"
          } else if (response.name === "harddrive") {
            reName = "Hard Drive: "
            reEnd = "GB"
          } else if (response.name === "nas") {
            reName = "External Drive: "
            reEnd = "GB"
          }
          gateright.innerHTML = reName + response.stat + reEnd;
        }
      } else if (response.command === "loadmessages") {
        console.log(response.lines);
        chatArea.innerHTML = "";
        lastNameUsed = "";
        lastIDUsed = 0;
        for (i=0; i in response.lines; i++) {
          if (response.lines[i] != false) {
            array = response.lines[i].replace("\n", "<br>").split("=>");
            insertName = array[0];
            date = array[1];
            message = array[2];
            if (lastNameUsed == insertName) {
              appendTo = document.getElementById(lastIDUsed).querySelector('[id=message]');
              appendTo.innerHTML += `${message}`
            } else {
              divID = Math.floor(Math.random() * 100000);
              lastNameUsed = insertName;
              lastIDUsed = divID;
              chatArea.innerHTML += "<div id='"+ divID +"'>" + `<div id='title'>${date}| ${insertName}</div><div id='message'>${message}</div></div>`
            }
            chatArea.scrollTo(0, chatArea.scrollHeight)
          }
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

function reload(id) {
  if (id == "chat") {
    makeRequest('php/commands.php', "message=");
  } else if(id == "MarketSell") {
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

function onLoad() {
  makeRequest('php/commands.php', "list");
  setTimeout(function(){ makeRequest('php/commands.php', "Finances"); }, 1000);
  setTimeout(function(){ makeRequest('php/commands.php', "message="); }, 2000);
  setTimeout(function(){ makeRequest('php/commands.php', "stats"); }, 3000);
  storage = localStorage.getItem("updates");
  if (storage !== "seen") {
    document.body.innerHTML += "<div id='unclickable'></div>";
    document.body.innerHTML += '<link href="css/updates.css" rel="stylesheet" type="text/css">'
    localStorage.setItem("updates", "seen");
  } else {
    document.getElementById("UpdateWindow").remove();
  }
}

function gateway(requested) {
  makeRequest('php/commands.php', requested);
}

const sendChat = (e, textarea) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    message = textarea.value.trim()
    textarea.value = "";
    function formatAMPM() {
      today = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Chicago"}));
      var hours = today.getHours();
      var minutes = today.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
    makeRequest('php/commands.php', 'message='+message);
  }
}