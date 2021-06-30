terminal = document.getElementById("TermWindow");
player = document.getElementById("audio-player-cont");
logs = document.getElementById("LogsWindow");
chat = document.getElementById("ChatWindow");
browser = document.getElementById("BrowserWindow");


window.onload = function() {
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }
  logsRequest('php/logs.php', "0,"+currentIP);
  document.getElementById("termarea").value = "";
  let termx = localStorage.getItem('termx');
  let termy = localStorage.getItem('termy');
  let termw = localStorage.getItem('termw');
  let termh = localStorage.getItem('termh');
  let Tactive = localStorage.getItem('Tactive');
  let logx = localStorage.getItem('logx');
  let logy = localStorage.getItem('logy');
  let logw = localStorage.getItem('logw');
  let logh = localStorage.getItem('logh');
  let Lactive = localStorage.getItem('Lactive');
  let chatx = localStorage.getItem('chatx');
  let chaty = localStorage.getItem('chaty');
  let chatw = localStorage.getItem('chatw');
  let chath = localStorage.getItem('chath');
  let Cactive = localStorage.getItem('Cactive');
  let browserx = localStorage.getItem('browserx');
  let browsery = localStorage.getItem('browsery');
  let browserw = localStorage.getItem('browserw');
  let browserh = localStorage.getItem('browserh');
  let Pactive = localStorage.getItem('Pactive');
  let musicx = localStorage.getItem('musicx');
  let musicy = localStorage.getItem('musicy');
  let Mactive = localStorage.getItem('Mactive');
  terminal.style.position = "absolute";
  terminal.style.left = termx+'px';
  terminal.style.top = termy+'px';
  terminal.style.width = termw+'px';
  terminal.style.height = termh+'px';
  logs.style.position = "absolute";
  logs.style.left = logx+'px';
  logs.style.top = logy+'px';
  logs.style.width = logw+'px';
  logs.style.height = logh+'px';
  chat.style.position = "absolute";
  chat.style.left = chatx+'px';
  chat.style.top = chaty+'px';
  chat.style.width = chatw+'px';
  chat.style.height = chath+'px';
  browser.style.position = "absolute";
  browser.style.left = browserx+'px';
  browser.style.top = browsery+'px';
  browser.style.width = browserw+'px';
  browser.style.height = browserh+'px';
  player.style.position = "absolute";
  player.style.left = musicx+'px';
  player.style.top = musicy+'px';
  if (Tactive === 'closed') {terminal.style.display = "none";}
  if (Lactive === 'closed') {logs.style.display = "none";}
  if (Cactive === 'closed') {chat.style.display = "none";}
  if (Pactive === 'closed') {browser.style.display = "none";}
  if (Mactive === 'closed') {player.style.display = "none";}
  windows = ['terminal', 'player', 'logs', 'chat', 'browser'];
  for (i = 0; i < windows.length; i++) {
    if (windows[i] === 'terminal') {
      elmnt = terminal;
    } else if (windows[i] === 'player') {
      elmnt = player;
    } else if (windows[i] === 'logs') {
      elmnt = logs;
    } else if (windows[i] === 'chat') {
      elmnt = chat;
    } else if (windows[i] === 'browser') {
      elmnt = browser;
    }
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

function OpenCloseTerm() {
  if (terminal.style.display === "none") {
    terminal.style.display = "block";
    localStorage.setItem('Tactive', 'opened');
  } else {
    terminal.style.display = "none";
    localStorage.setItem('Tactive', 'closed');
  }
}

function OpenCloseLogs() {
  if (logs.style.display === "none") {
    logs.style.display = "block";
    localStorage.setItem('Lactive', 'opened');
  } else {
    logs.style.display = "none";
    localStorage.setItem('Lactive', 'closed');
  }
}

function OpenCloseChat() {
  if (chat.style.display === "none") {
    chat.style.display = "block";
    localStorage.setItem('Cactive', 'opened');
  } else {
    chat.style.display = "none";
    localStorage.setItem('Cactive', 'closed');
  }
}

function OpenCloseBrowser() {
  if (browser.style.display === "none") {
    browser.style.display = "block";
    localStorage.setItem('Pactive', 'opened');
  } else {
    browser.style.display = "none";
    localStorage.setItem('Pactive', 'closed');
  }
}

resizeElemnt(terminal);
resizeElemnt(logs);
resizeElemnt(chat);
resizeElemnt(browser);

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
    Arr1 = [elmnt.offsetLeft, elmnt.offsetTop, elmnt.offsetWidth, elmnt.offsetHeight];
    if (elmnt.id === "TermWindow") {
      termArr = ['termx', 'termy', 'termw', 'termh'];
      for (i = 0; i < termArr.length; i++) {
        localStorage.setItem(termArr[i], Arr1[i]);
      }
    } else if (elmnt.id === "audio-player-cont") {
      localStorage.setItem('musicx', elmnt.offsetLeft);
      localStorage.setItem('musicy', elmnt.offsetTop);
    } else if (elmnt.id === "LogsWindow") {
      logArr = ['logx', 'logy', 'logw', 'logh'];
      for (i = 0; i < logArr.length; i++) {
        localStorage.setItem(logArr[i], Arr1[i]);
      }
    } else if (elmnt.id === "ChatWindow") {
      chatArr = ['chatx', 'chaty', 'chatw', 'chath'];
      for (i = 0; i < chatArr.length; i++) {
        localStorage.setItem(chatArr[i], Arr1[i]);
      }
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

terminal.addEventListener('mousedown', e => {
  terminal.style.zIndex = "10";
  player.style.zIndex = "1";
  logs.style.zIndex = "1";
  browser.style.zIndex = "1";
});

player.addEventListener('mousedown', e => {
  player.style.zIndex = "10";
  terminal.style.zIndex = "1";
  logs.style.zIndex = "1";
  browser.style.zIndex = "1";
});

logs.addEventListener('mousedown', e => {
  logs.style.zIndex = "10";
  terminal.style.zIndex = "1";
  player.style.zIndex = "1";
  browser.style.zIndex = "1";
});

browser.addEventListener('mousedown', e => {
  browser.style.zIndex = "10";
  logs.style.zIndex = "1";
  terminal.style.zIndex = "1";
  player.style.zIndex = "1";
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