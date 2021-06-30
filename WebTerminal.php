<?php

session_start();

require 'php/db.php';

if(isset($_SESSION['id']) ){

  $id = $_SESSION['id'];
  $User['id'] = $_SESSION['id'];
  $User['username'] = $_SESSION['username'];
  $User['email'] = $_SESSION['email'];
  $User['ip'] = $_SESSION['ip'];

	$sql = "SELECT id,email,`password` FROM users WHERE id = '$id'";
	$query = $conn->query($sql);
    while($result = $query->fetch_assoc()){
      $results = $result['email'];
    }

	if(isset($results)){} else {
		header("Location: http://localhost:3000/logout.php");
	}

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
  <title>SH3?</title>
</head>
<body>
  <?php //require 'php/GetIP.php'; ?>
  <div id="audio-player-cont">
    <div id="audio-player-contheader">
      <div id="Title">
        <b>MusicPlayer</b>
      </div>
      <div id="buttons">
        <img src="Pictures/close.png" width="15px" onclick="OpenCloseMusic();">
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
        var username = "<?php echo $User['username'] ?>"
        header = document.getElementById("TermTitle");
        header.innerHTML = "<b>WebTerminal - " + currentIP + "</b>";
      </script>
      <div id="buttons">
        <img src="Pictures/close.png" width="15px" onclick="OpenCloseTerm();">
      </div>
    </div>
    <div id='terminal' onclick="TextBox();">
      <div id="command-output"></div>
      <div id="command-input">
        <span style="color:#cc0000">┌─[</span><span style="color:#00ff00"><?php echo $User['username'] ?></span><span style="color:#f5dd3d">@</span><span style="color:#34e2e2">nooB</span><span style="color:#cc0000">]─[</span><span id="connectedIP" style="color:#00ff00">~</span><span style="color:#cc0000">]<br>└──╼ </span><span style="color:#f5dd3d">$</span>
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
        <img src="Pictures/close.png" id='close' width="15px" onclick="OpenCloseLogs();">
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
        <img src="Pictures/close.png" width="15px" onclick="OpenCloseChat();">
      </div>
    </div>
    <div id="user-messages"></div>
    <textarea id="send-message" style="overflow: hidden;" spellcheck="false" wrap="off" rows="1" onkeypress="sendChat(event, this)"></textarea>
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
        <img src="Pictures/reload.png" id="reload" width="15px" onclick="reload();">
        <img src="Pictures/close.png" id='close' width="15px" onclick="OpenCloseBrowser();">
      </div>
    </div>
    <div id="BrowserArea">
      <textarea id="searchbar" style="overflow: hidden;" spellcheck="false" wrap="off" rows="1" onkeypress="search(event, this)"></textarea>
    </div>
  </div>
</body>
  <footer>
		<nav>
      <div class="windows">
        <img class="dropbtn" src="Pictures/menu.png" width="45px" onclick="popup()">
        <img class="dropbtn" src="Pictures/terminal.png" width="45px" onclick="OpenCloseTerm()">
        <img class="dropbtn" src="Pictures/music.png" width="45px" onclick="OpenCloseMusic()">
        <img class="dropbtn" src="Pictures/log.png" width="45px" onclick="OpenCloseLogs()">
        <img class="dropbtn" src="Pictures/chat.png" width="45px" onclick="OpenCloseChat()">
        <img class="dropbtn" src="Pictures/browser.png" width="45px" onclick="OpenCloseBrowser()">
      </div>
      <div id="dropdown-content">
        <a style="cursor: pointer;" onclick="resetIP()">Reset IP</a>
        <a href="#">Link 2</a>
        <a href="logout.php">Logout</a>
      </div>
		</nav>	
  </footer>
  <script type="text/javascript" src="JS/commands.js"></script>
  <script type="text/javascript" src="JS/chat.js"></script>
  <script type="text/javascript" src="JS/player.js"></script>
  <script type="text/javascript" src="JS/moveDIV.js"></script>
</html>