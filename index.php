<?php

session_start();

require 'php/db.php';

if(isset($_SESSION['id']) ){
  $User['id'] = $_SESSION['id'];
  $User['username'] = $_SESSION['username'];
  $User['email'] = $_SESSION['email'];
  $User['ip'] = $_SESSION['ip'];
} else {
  header("Location: http://localhost:3000/logout.php");
}
?>
<!DOCTYPE html>
<html>
<head>
  <link href="css/terminal.css" rel="stylesheet" type="text/css">
  <link href="css/musicgame.css" rel="stylesheet" type="text/css">
  <link href="css/logs.css" rel="stylesheet" type="text/css">
  <link href="css/chat.css" rel="stylesheet" type="text/css">
  <link href="css/browser.css" rel="stylesheet" type="text/css">
  <link href="css/finances.css" rel="stylesheet" type="text/css">
  <link href="css/npc.css" rel="stylesheet" type="text/css">
  <link href="css/gate.css" rel="stylesheet" type="text/css">
  <title>SH3?</title>

  <script type='text/javascript'>
    const username = "<?php echo $User['username']; ?>";
    const id = "<?php echo $User['id']; ?>";
  </script>
  
</head>
<body>
  <div id="AllWindows">
    <div id="audio-player-cont">
      <div id="audio-player-contheader">
        <div id="Title">
          <b>MusicPlayer</b>
        </div>
        <div id="buttons">
          <img src="Pictures/close.png" width="15px" onclick="OpenClose('audio-player-cont');">
        </div>
      </div>
      <div class="player">
        <div id="songTitle" class="song-title">Song Title Here</div>          
        <input id="songSlider" class="song-slider" type="range" min="0" step="1" onchange="seekSong()">
        <div>
          <div id="currentTime" class="current-time">00:00</div>
          <div id="duration" class="duration">00:00</div>
        </div>
        <div class="controllers">
          <img src="Pictures/previous.png" width="30px" onclick="previous();">
          <img id="img" src="Pictures/play.png" width="30px" onclick="playOrPauseSong();">
          <img src="Pictures/next.png" width="30px" onclick="next();">
          <img src="Pictures/volume-down.png" width="15px">
          <input id="volumeSlider" class="volume-slider" type="range" min="0" max="1" step="0.01" onchange="adjustVolume()">
          <img src="Pictures/volume-up.png" width="15px" style="margin-left: 2px;">
        </div>
        <div id="nextSongTitle" class="song-title"><b>Next Song: </b>Next song goes here</div>
      </div>
    </div>
    <div id="TermWindow" class="resizeable">
      <div id="TermWindowresize-tleft" class="resize"></div>
      <div id="TermWindowresize-tright" class="resize"></div>
      <div id="TermWindowresize-bleft" class="resize"></div>
      <div id="TermWindowresize-bright" class="resize"></div>
      <div id="TermWindowheader">
        <div id="TermTitle"><b>WebTerminal - IP</b></div>
        <script> 
          var currentIP = "<?php echo $User['ip'] ?>";
          header = document.getElementById("TermTitle");
          header.innerHTML = "<b>WebTerminal - " + currentIP + "</b>";
        </script>
        <div id="buttons">
          <img src="Pictures/close.png" width="15px" onclick="OpenClose('TermWindow');">
        </div>
      </div>
      <div id='terminal' onclick="TextBox();">
        <div id="command-output"></div>
        <div id="command-input">
          <span style="color:#cc0000">??????[</span><span style="color:#00ff00"><?php echo $User['username'] ?></span><span style="color:#f5dd3d">@</span><span style="color:#34e2e2">nooB</span><span style="color:#cc0000">]???[</span><span id="connectedIP" style="color:#00ff00">~</span><span style="color:#cc0000">]<br>???????????? </span><span style="color:#f5dd3d">$</span>
          <textarea id="termarea" style="overflow: hidden;" spellcheck="false" wrap="off" rows="1" onkeypress="submit(event, this)"></textarea>
        </div>
      </div>
    </div>
    <div id="LogsWindow" class="resizeable">
      <div id="LogsWindowresize-tleft" class="resize"></div>
      <div id="LogsWindowresize-tright" class="resize"></div>
      <div id="LogsWindowresize-bleft" class="resize"></div>
      <div id="LogsWindowresize-bright" class="resize"></div>
      <div id="LogsWindowheader">
        <div id="LogsTitle"><b>Logs - Local</b></div>
        <div id="buttons">
          <div id="switch" onclick="switchTo();">Switch to Remote</div>
          <img src="Pictures/close.png" id='close' width="15px" onclick="OpenClose('LogsWindow');">
        </div>
      </div>
      <div id="logs-remote" class='logs' style="display:none;"></div>
      <div id="logs-local" class='logs'></div>
    </div>
    <div id="ChatWindow" class="resizeable">
      <div id="ChatWindowresize-tleft" class="resize"></div>
      <div id="ChatWindowresize-tright" class="resize"></div>
      <div id="ChatWindowresize-bleft" class="resize"></div>
      <div id="ChatWindowresize-bright" class="resize"></div>
      <div id="ChatWindowheader">
        <div id="ChatTitle"><b>Chat</b></div>
        <div id="buttons">
          <img src="Pictures/reload.png" id="reload" width="15px" onclick="reload('chat');">
          <img src="Pictures/close.png" width="15px" onclick="OpenClose('ChatWindow');">
        </div>
      </div>
      <div id="user-messages"></div>
      <textarea id="send-message" style="overflow: hidden;" spellcheck="false" wrap="off" rows="1" onkeypress="sendChat(event, this, username)"></textarea>
    </div>
    <div id="notify"></div>
    <div id="BrowserWindow" class="resizeable">
      <div id="BrowserWindowresize-tleft" class="resize"></div>
      <div id="BrowserWindowresize-tright" class="resize"></div>
      <div id="BrowserWindowresize-bleft" class="resize"></div>
      <div id="BrowserWindowresize-bright" class="resize"></div>
      <div id="BrowserWindowheader">
        <div id="BrowserTitle"><b>Browser</b></div>
        <div id="buttons">
          <img src="Pictures/reload.png" id="reload" width="15px" onclick="reload('MarketSell');">
          <img src="Pictures/close.png" id='close' width="15px" onclick="OpenClose('BrowserWindow');">
        </div>
      </div>
      <div id="BrowserArea">
        <textarea id="searchbar" style="overflow: hidden;" spellcheck="false" wrap="off" rows="1" onkeypress="search(event, this)"></textarea>
      </div>
    </div>
    <div id="FinancesWindow" class="resizeable">
      <div id="FinancesWindowresize-tleft" class="resize"></div>
      <div id="FinancesWindowresize-tright" class="resize"></div>
      <div id="FinancesWindowresize-bleft" class="resize"></div>
      <div id="FinancesWindowresize-bright" class="resize"></div>
      <div id="FinancesWindowheader">
        <div id="FinancesTitle"><b>Finances</b></div>
        <div id="buttons">
          <img src="Pictures/reload.png" id="reload" width="15px" onclick="Finances()">
          <img src="Pictures/close.png" id='close' width="15px" onclick="OpenClose('FinancesWindow');">
        </div>
      </div>
      <div id="FinancesArea">
        <div id="Financesleft">
          <div id="USDTitle" style="color:white; padding-top:8px;">Bank Accounts</div>
          <div id="moneyTotal" style="color:green; padding-top:4px; font-size:75%;">$69,420.00</div>
          <table  id="accountTable" width='100%' style="color:white; padding-top:16px;">
            <tr>
              <th style="text-align:center; font-weight:bold; font-size:100%;">Account</th>
              <th style="text-align:center; font-weight:bold; font-size:100%;">Total</th>
            </tr>
          </table>
        </div>
        <div id="Financesright">
          <div id="BTCTitle" style="color:white; padding-top:8px;">BTC Account</div>
          <div id="btcTotal" style="color:yellow; padding-top:4px; font-size:75%;">69,420.00</div>
          <br>
          <select id="btcOptions" style='width: 95%' onchange='BTC(value)'>
            <option value="redeem">Redeem Packet</option>
            <option value="create">Create Packet</option>
            <option value="buy">Buy BTC</option>
            <option value="sell">Sell BTC</option>
          </select>
          <div id="OptionArea"></div>
        </div>
      </div>
    </div>
    <div id="NPCWindow" class="resizeable">
      <div id="NPCWindowresize-tleft" class="resize"></div>
      <div id="NPCWindowresize-tright" class="resize"></div>
      <div id="NPCWindowresize-bleft" class="resize"></div>
      <div id="NPCWindowresize-bright" class="resize"></div>
      <div id="NPCWindowheader">
        <div id="NPCTitle"><b>NPC</b></div>
        <div id="buttons">
          <img src="Pictures/reload.png" id="reload" width="15px" onclick="reload();">
          <img src="Pictures/close.png" id='close' width="15px" onclick="OpenClose('NPCWindow');">
        </div>
      </div>
      <div id="NPCArea">
        <div id="NPCListCollapse" onclick="OpenClose('NPCList')">NPCs</div>
        <div id="NPCList"></div>
        <div id="PlayerListCollapse" onclick="OpenClose('PlayerList')">Players</div>
        <div id="PlayerList"></div>
      </div>
    </div>
    <div id="GateWindow" class="resizeable">
      <div id="GateWindowresize-tleft" class="resize"></div>
      <div id="GateWindowresize-tright" class="resize"></div>
      <div id="GateWindowresize-bleft" class="resize"></div>
      <div id="GateWindowresize-bright" class="resize"></div>
      <div id="GateWindowheader">
        <div id="GateTitle"><b>Gateway</b></div>
        <div id="buttons">
          <img src="Pictures/reload.png" id="reload" width="15px" onclick="reload();">
          <img src="Pictures/close.png" id='close' width="15px" onclick="OpenClose('GateWindow');">
        </div>
      </div>
      <div id="GateArea">
        <div id="Gateleft">
          <img class="dropbtn" src="Pictures/stats.png" width="45px" onclick="gateway('stats')">
          <img class="dropbtn" src="Pictures/cpu.png" width="45px" onclick="gateway('cpu')">
          <img class="dropbtn" src="Pictures/network.png" width="45px" onclick="gateway('network')">
          <img class="dropbtn" src="Pictures/harddrive.png" width="45px" onclick="gateway('harddrive')">
          <img class="dropbtn" src="Pictures/nas.png" width="45px" onclick="gateway('nas')">
        </div>
        <div id="Gateright"></div>
      </div>
    </div>
    <div id="UpdateWindow">
      <div id="UpdateWindowheader">
        <div id="UpdateTitle"><b>Updates</b></div>
        <div id="buttons">
          <img src="Pictures/close.png" id='close' width="15px" onclick="location.reload();">
        </div>
      </div>
      <div id="UpdateArea">
        <div id="UpdateText">
          <b>ToDo List:</b><br><br>

          Add missions which gives money and rep <br><br>
          Make a gateway to show player stats and hardware <br><br>
          Allow players to upgrade stats with money and when added btc <br><br>
          Make npc/player list only list ips that you have found <br><br>
          Task manager and delayed tasks based on hardware <br><br>
          Place special files on certain npcs <br><br>
          Add a way to use inventory items <br><br>
          Add clickable icons to browser of main pages like the market <br><br>
          Buying stuff from market costs money <br><br>
          Btc covertion to money and money to btc <br><br>
          Notepad and user notes on npcs/players <br><br>
          Add a bit more style to the game <br><br>
          Harass jesse about how good my game is <br><br>
          Clean up some of the code and continue to harass jesse <br><br>

          <b>Done:</b> <br><br>

          Make npc/player list and finance list load when the page is first loaded<br><br>
          Make a update notification pop up when there has been a change<br><br>
          Make chat more secure
        </div>
      </div>
    </div>
  </div>
</body>
  <footer>
		<nav>
      <div class="icons">
        <img class="dropbtn" src="Pictures/menu.png" width="45px" onclick="popup()">
        <img class="dropbtn" src="Pictures/terminal.png" width="45px" onclick="OpenClose('TermWindow')">
        <img class="dropbtn" src="Pictures/music.png" width="45px" onclick="OpenClose('audio-player-cont')">
        <img class="dropbtn" src="Pictures/log.png" width="45px" onclick="OpenClose('LogsWindow')">
        <img class="dropbtn" src="Pictures/chat.png" width="45px" onclick="OpenClose('ChatWindow')">
        <img class="dropbtn" src="Pictures/browser.png" width="45px" onclick="OpenClose('BrowserWindow')">
        <img class="dropbtn" src="Pictures/finances.png" width="45px" onclick="OpenClose('FinancesWindow')">
        <img class="dropbtn" src="Pictures/task.png" width="45px" onclick="OpenClose('TaskWindow')">
        <img class="dropbtn" src="Pictures/npc.png" width="45px" onclick="OpenClose('NPCWindow')">
      </div>
      <div id="dropdown-content">
        <a style="cursor: pointer;" onclick="resetIP()">Reset IP</a>
        <a href="#">Link 2</a>
        <a href="logout.php">Logout</a>
      </div>
		</nav>	
  </footer>
  <script type="text/javascript" src="JS/commands.js"></script>
  <script type="text/javascript" src="JS/player.js"></script>
  <script type="text/javascript" src="JS/moveDIV.js"></script>
</html>
