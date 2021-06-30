terminal = document.getElementById("TermWindow");
player = document.getElementById("audio-player-cont");
logs = document.getElementById("LogsWindow");
chat = document.getElementById("ChatWindow");
browser = document.getElementById("BrowserWindow");
finances = document.getElementById("FinancesWindow");
task = document.getElementById("TaskWindow");
npc = document.getElementById("NPCWindow");

let wIndexArray = localStorage.getItem('wIndexArray');
if (wIndexArray !== null) {
  wIndexArray = wIndexArray.split(',');
} else {
  wIndexArray = ['player', 'chat', 'browser', 'logs', 'terminal',];
  localStorage.setItem('wIndexArray', wIndexArray);
}

window.onload = function() {
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }
  logsRequest('php/logs.php', "0,"+currentIP);
  document.getElementById("termarea").value = "";

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
    }
  }

  ajustW = ['TermWindow', 'LogsWindow', 'ChatWindow','BrowserWindow', 'audio-player-cont']
  for(var i = 0; i < ajustW.length; i++) {
    elmnt = document.getElementById(ajustW[i]);
    storage = localStorage.getItem(ajustW[i]);
    if (storage !== null) {
      storage = storage.split(',');
    } else {
      storage = [500, 500, 500, 500];
      localStorage.setItem(ajustW[i], storage);
    }

    if (ajustW[i] === 'TermWindow' || ajustW[i] === 'LogsWindow' || ajustW[i] === 'ChatWindow' || ajustW[i] === 'BrowserWindow' || ajustW[i] === 'audio-player-cont' || ajustW[i] === 'FinancesWindow' || ajustW[i] === 'TaskWindow' || ajustW[i] === 'NPCWindow') {

      elmnt.style.position = "absolute";
      elmnt.style.left = storage[0]+'px';
      elmnt.style.top = storage[1]+'px';
      elmnt.style.width = storage[2]+'px';
      elmnt.style.height = storage[3]+'px';

    } else if (ajustW[i] === 'audio-player-cont') {

      elmnt.style.position = "absolute";
      elmnt.style.left = '310px';
      elmnt.style.top = '135px';

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
  if (elmnt.style.display === "none") {
    elmnt.style.display = "block";
    localStorage.setItem(id+'Active', 'opened');
  } else {
    elmnt.style.display = "none";
    localStorage.setItem(id+'Active', 'closed');
  }
}

resizeElemnt(terminal);
resizeElemnt(logs);
resizeElemnt(chat);
resizeElemnt(browser);
resizeElemnt(finances);
resizeElemnt(task);
resizeElemnt(npc);

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
dragElement(task);
dragElement(npc);
    
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
    if (elmnt.id === "audio-player-cont") {
      localStorage.setItem('audio-player-cont', Arr[0] + "," + Arr[1]);
    } else {
      localStorage.setItem(elmnt.id, Arr);
    }
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
    }
  }
});

function TextBox() {
  document.getElementById("termarea").focus();
}

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
