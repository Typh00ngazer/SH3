terminal = document.getElementById("TermWindow");
player = document.getElementById("audio-player-cont");
logs = document.getElementById("LogsWindow");
chat = document.getElementById("ChatWindow");
browser = document.getElementById("BrowserWindow");
finances = document.getElementById("FinancesWindow");
npc = document.getElementById("NPCWindow");
gate = document.getElementById("GateWindow");

let wIndexArray = localStorage.getItem('wIndexArray');
if (wIndexArray !== null) {
  wIndexArray = wIndexArray.split(',');
} else {
  wIndexArray = ['player', 'chat', 'npc', 'browser', 'gate', 'finances', 'logs', 'terminal',];
  localStorage.setItem('wIndexArray', wIndexArray);
}

window.onload = function() {
  // if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
  //   httpRequest = new XMLHttpRequest();
  // } else if (window.ActiveXObject) { // IE 6 and older
  //   httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  // }
  document.getElementById("termarea").value = "";

  onLoad();

  for(var i = 0; i < wIndexArray.length; i++) {
    if (wIndexArray[i] === 'player') {
      player.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'logs') {
      logs.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'browser') {
      browser.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'terminal') {
      terminal.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'chat') {
      chat.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'finances') {
      finances.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'npc') {
      npc.style.zIndex = i+1;
    }
  }

  ajustW = ['TermWindow', 'LogsWindow', 'ChatWindow','BrowserWindow', 'GateWindow', 'audio-player-cont', 'FinancesWindow', 'NPCWindow'];
  for(var i = 0; i < ajustW.length; i++) {
    elmnt = document.getElementById(ajustW[i]);
    storage = localStorage.getItem(ajustW[i]);
    if (storage !== null) {
      storage = storage.split(',');
    } else {
      storage = [0, 0, 250, 250];
      localStorage.setItem(ajustW[i], storage);
    }

    if (ajustW[i] !== 'audio-player-cont') {

      elmnt.style.position = "absolute";
      elmnt.style.left = storage[0]+'px';
      elmnt.style.top = storage[1]+'px';
      elmnt.style.width = storage[2]+'px';
      elmnt.style.height = storage[3]+'px';

    } else {

      elmnt.style.position = "absolute";
      elmnt.style.left = storage[0]+'px';
      elmnt.style.top = storage[1]+'px';
      elmnt.style.width = '312px';
      elmnt.style.height = '137px';

    }

    active = localStorage.getItem(ajustW[i]+"Active");
    if (active === 'closed') {elmnt.style.display = "none";}

    if (elmnt.offsetWidth > document.documentElement.clientWidth) {elmnt.style.width = document.documentElement.clientWidth+'px';}
    if (elmnt.offsetHeight > document.documentElement.clientHeight - 50) {elmnt.style.height = document.documentElement.clientHeight - 50+'px';}
    if (elmnt.offsetTop < 0) {elmnt.style.top = "0px";}
    if (elmnt.offsetLeft < 0) {elmnt.style.left = "0px";}
    if (elmnt.offsetLeft + elmnt.offsetWidth > document.documentElement.clientWidth) {elmnt.style.left = document.documentElement.clientWidth - terminal.offsetWidth+'px';}
    if (elmnt.offsetTop + elmnt.offsetHeight > document.documentElement.clientHeight-50) {elmnt.style.top = document.documentElement.clientHeight - terminal.offsetHeight-50+'px';}
  }
  document.getElementById("OptionArea").innerHTML = "<form onsubmit='redeem(input.value);return false;'>"
  + "<input id='input' style='width: 90%' type='text' placeholder='Enter a BTC Packet'>"
  + "<input type='submit' style='width: 95%' value='Consume Packet'></form>"
};

function popup() {
  if (document.getElementById("dropdown-content").style.display === "block") {
    document.getElementById("dropdown-content").style.display = "none";
  } else {
    document.getElementById("dropdown-content").style.display = "block";
  }
}

function OpenClose(id) {
  elmnt = document.getElementById(id);
  if (elmnt.id == "UpdateWindow") {
    document.getElementById("unclickable").remove();
    elmnt.remove();
  } else {
    if (elmnt.style.display === "none") {
      elmnt.style.display = "block";
      localStorage.setItem(id+'Active', 'opened');
    } else {
      elmnt.style.display = "none";
      localStorage.setItem(id+'Active', 'closed');
    }
  }
}

resizeElemnt(terminal);
resizeElemnt(logs);
resizeElemnt(chat);
resizeElemnt(browser);
resizeElemnt(finances);
resizeElemnt(npc);
resizeElemnt(gate);

function resizeElemnt(element) {
  const minimum_size = 300;
  let original_width = 0;
  let original_height = 0;
  let original_x = 0;
  let original_y = 0;
  let original_mouse_x = 0;
  let original_mouse_y = 0;
  var headers = document.getElementsByClassName('resize');
  var array = Array.from(headers).map((elem) => elem.id);
  for(var i=0; i<array.length; i++) {
    const currentResizer = document.getElementById(array[i]);
    currentResizer.addEventListener('mousedown', function(e) {
      e = e || window.event;
      e.preventDefault();
      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
      original_x = element.getBoundingClientRect().left;
      original_y = element.getBoundingClientRect().top;
      original_mouse_x = e.pageX;
      original_mouse_y = e.pageY;
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResize)
    })
    
    function resize(e) {
      if (currentResizer.id === element.id + 'resize-tleft') {
        const width = original_width - (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      } else if (currentResizer.id === element.id + 'resize-tright') {
        const width = original_width + (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      } else if (currentResizer.id === element.id + 'resize-bleft') {
        const height = original_height + (e.pageY - original_mouse_y)
        const width = original_width - (e.pageX - original_mouse_x)
        if (height > minimum_size) {
          element.style.height = height + 'px'
        }
        if (width > minimum_size) {
          element.style.width = width + 'px'
          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }
      } else if (currentResizer.id === element.id + 'resize-bright') {
        const width = original_width + (e.pageX - original_mouse_x);
        const height = original_height + (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
        }
      }
    }
    function stopResize() {
      window.removeEventListener('mousemove', resize)
    }
  }
}

dragElement(terminal);
dragElement(logs);
dragElement(chat);
dragElement(browser);
dragElement(player);
dragElement(finances);
dragElement(npc);
dragElement(gate);
    
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0;
  document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos1 = e.clientX - elmnt.getBoundingClientRect().left;
    pos2 = e.clientY - elmnt.getBoundingClientRect().top;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    elmnt.style.left = (e.clientX - pos1) + "px";
    elmnt.style.top = (e.clientY - pos2) + "px";
    if (elmnt.offsetWidth > document.documentElement.clientWidth) {elmnt.style.width = document.documentElement.clientWidth+'px';}
    if (elmnt.offsetHeight > document.documentElement.clientHeight - 50) {elmnt.style.height = document.documentElement.clientHeight - 50 +'px';}
    if (elmnt.offsetTop < 0) {elmnt.style.top = "0px";}
    if (elmnt.offsetLeft < 0) {elmnt.style.left = "0px";}
    if (elmnt.offsetLeft + elmnt.offsetWidth > document.documentElement.clientWidth) {elmnt.style.left = document.documentElement.clientWidth - elmnt.offsetWidth+'px';}
    if (elmnt.offsetTop + elmnt.offsetHeight > document.documentElement.clientHeight-50) {elmnt.style.top = document.documentElement.clientHeight - elmnt.offsetHeight-50+'px';}
  }
  
  function closeDragElement() {
    Arr = [elmnt.offsetLeft, elmnt.offsetTop, elmnt.offsetWidth, elmnt.offsetHeight];
    localStorage.setItem(elmnt.id, Arr);
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

terminal.addEventListener('mousedown', e => {
  wIndexArray = wIndexArray.filter(e => e !== 'terminal');
  wIndexArray.push('terminal');
  localStorage.setItem('wIndexArray', wIndexArray);
  for(var i = 0; i < wIndexArray.length; i++) {
    if (wIndexArray[i] === 'player') {
      player.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'logs') {
      logs.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'chat') {
      chat.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'browser') {
      browser.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'terminal') {
      terminal.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'finances') {
      finances.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'task') {
      task.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'npc') {
      npc.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'gate') {
      gate.style.zIndex = i+1;
    }
  }
});

player.addEventListener('mousedown', e => {
  wIndexArray = wIndexArray.filter(e => e !== 'player');
  wIndexArray.push('player');
  localStorage.setItem('wIndexArray', wIndexArray);
  for(var i = 0; i < wIndexArray.length; i++) {
    if (wIndexArray[i] === 'player') {
      player.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'logs') {
      logs.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'chat') {
      chat.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'browser') {
      browser.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'terminal') {
      terminal.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'finances') {
      finances.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'task') {
      task.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'npc') {
      npc.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'gate') {
      gate.style.zIndex = i+1;
    }
  }
});

logs.addEventListener('mousedown', e => {
  wIndexArray = wIndexArray.filter(e => e !== 'logs');
  wIndexArray.push('logs');
  localStorage.setItem('wIndexArray', wIndexArray);
  for(var i = 0; i < wIndexArray.length; i++) {
    if (wIndexArray[i] === 'player') {
      player.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'logs') {
      logs.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'chat') {
      chat.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'browser') {
      browser.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'terminal') {
      terminal.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'finances') {
      finances.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'task') {
      task.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'npc') {
      npc.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'gate') {
      gate.style.zIndex = i+1;
    }
  }
});

browser.addEventListener('mousedown', e => {
  wIndexArray = wIndexArray.filter(e => e !== 'browser');
  wIndexArray.push('browser');
  localStorage.setItem('wIndexArray', wIndexArray);
  for(var i = 0; i < wIndexArray.length; i++) {
    if (wIndexArray[i] === 'player') {
      player.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'logs') {
      logs.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'chat') {
      chat.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'browser') {
      browser.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'terminal') {
      terminal.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'finances') {
      finances.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'task') {
      task.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'npc') {
      npc.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'gate') {
      gate.style.zIndex = i+1;
    }
  }
});

chat.addEventListener('mousedown', e => {
  wIndexArray = wIndexArray.filter(e => e !== 'chat');
  wIndexArray.push('chat');
  localStorage.setItem('wIndexArray', wIndexArray);
  for(var i = 0; i < wIndexArray.length; i++) {
    if (wIndexArray[i] === 'player') {
      player.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'logs') {
      logs.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'chat') {
      chat.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'browser') {
      browser.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'terminal') {
      terminal.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'finances') {
      finances.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'task') {
      task.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'npc') {
      npc.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'gate') {
      gate.style.zIndex = i+1;
    }
  }
});

finances.addEventListener('mousedown', e => {
  wIndexArray = wIndexArray.filter(e => e !== 'finances');
  wIndexArray.push('finances');
  localStorage.setItem('wIndexArray', wIndexArray);
  for(var i = 0; i < wIndexArray.length; i++) {
    if (wIndexArray[i] === 'player') {
      player.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'logs') {
      logs.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'chat') {
      chat.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'browser') {
      browser.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'terminal') {
      terminal.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'finances') {
      finances.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'task') {
      task.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'npc') {
      npc.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'gate') {
      gate.style.zIndex = i+1;
    }
  }
});

npc.addEventListener('mousedown', e => {
  wIndexArray = wIndexArray.filter(e => e !== 'npc');
  wIndexArray.push('npc');
  localStorage.setItem('wIndexArray', wIndexArray);
  for(var i = 0; i < wIndexArray.length; i++) {
    if (wIndexArray[i] === 'player') {
      player.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'logs') {
      logs.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'chat') {
      chat.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'browser') {
      browser.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'terminal') {
      terminal.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'finances') {
      finances.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'task') {
      task.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'npc') {
      npc.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'gate') {
      gate.style.zIndex = i+1;
    }
  }
});

gate.addEventListener('mousedown', e => {
  wIndexArray = wIndexArray.filter(e => e !== 'gate');
  wIndexArray.push('gate');
  localStorage.setItem('wIndexArray', wIndexArray);
  for(var i = 0; i < wIndexArray.length; i++) {
    if (wIndexArray[i] === 'player') {
      player.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'logs') {
      logs.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'chat') {
      chat.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'browser') {
      browser.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'terminal') {
      terminal.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'finances') {
      finances.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'task') {
      task.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'npc') {
      npc.style.zIndex = i+1;
    } else if (wIndexArray[i] === 'gate') {
      gate.style.zIndex = i+1;
    }
  }
});

function TextBox() {document.getElementById("termarea").focus();}

function switchTo() {
  remotelog = document.getElementById("logs-remote");
  locallog = document.getElementById("logs-local");
  logsTitle = document.getElementById("LogsTitle");
  switchlogs = document.getElementById("switch");
  if (remotelog.style.display === "none") {
    logsTitle.innerHTML = "<b>Logs - Remote</b>"
    switchlogs.innerHTML = "Switch to Local"
    locallog.style.display = "none";
    remotelog.style.display = "block";
  } else {
    logsTitle.innerHTML = "<b>Logs - Local</b>"
    switchlogs.innerHTML = "Switch to Remote"
    remotelog.style.display = "none";
    locallog.style.display = "block";
  }
}