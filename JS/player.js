var songs = ["Bad-History.ogg", "Beats.ogg", "DrazRap.ogg", "DUMBO.ogg", "Bad-History-BIDEN-_Timefracture_.ogg", "rando-claps.ogg", "STARS.ogg", "TIMEFRACTURE.ogg", "Unus-Annus-Disclaimer-Song.ogg"];
var songTitle = document.getElementById('songTitle');
var songSlider = document.getElementById('songSlider');
var currentTime = document.getElementById('currentTime');
var duration = document.getElementById('duration');
var volumeSlider = document.getElementById('volumeSlider');
var nextSongTitle = document.getElementById('nextSongTitle');
var song = new Audio();
var currentSong = 0;
var len = songs.length

window.onload = loadSong();
function loadSong () {
  song.src = "songs/" + songs[currentSong];
  songTitle.textContent = (currentSong + 1) + ". " + songs[currentSong];
  nextSongTitle.innerHTML = "<b>Next Song: </b>" + songs[currentSong + 1]
  if (nextSongTitle.innerHTML == "<b>Next Song: </b>undefined") {
    nextSongTitle.innerHTML = "<b>Next Song: </b>" + songs[0];
  }
  song.playbackRate = 1;
  song.volume = volumeSlider.value;
  function wait () {
    if (isNaN(song.duration)) {
      setTimeout(wait, 1000);
    } else {
      showDuration();
    }
  }
  wait();
}
            
setInterval(updateSongSlider, 1000);
            
function updateSongSlider () {
  var c = Math.round(song.currentTime);
  songSlider.value = c;
  currentTime.textContent = convertTime(c);
  if(song.ended){
    next();
  }
}
            
function convertTime (secs) {
  var min = Math.floor(secs/60);
  var sec = secs % 60;
  min = (min < 10) ? "0" + min : min;
  sec = (sec < 10) ? "0" + sec : sec;
    return (min + ":" + sec);
}
            
function showDuration () {
  var d = Math.floor(song.duration);
  songSlider.setAttribute("max", d);
  duration.textContent = convertTime(d);
}
            
function playOrPauseSong () {
  var img =  document.getElementById("img");
  song.playbackRate = 1;
  if(song.paused){
    song.play();
    img.src = "Pictures/pause.png";
  } else {
    song.pause();
    img.src = "Pictures/play.png";
  }
}
            
function next(){
  currentSong++;
  currentSong = (currentSong > len - 1) ? len - len : currentSong;
  loadSong();
  song.play();
}
            
function previous () {
  currentSong--;
  currentSong = (currentSong < 0) ? len - 1 : currentSong;
  loadSong();
}

function seekSong () {
  song.currentTime = songSlider.value;
  currentTime.textContent = convertTime(song.currentTime);
}
            
function adjustVolume () {
  song.volume = volumeSlider.value;
}

function increasePlaybackRate () {
  songs.playbackRate += 0.5;
}
            
function decreasePlaybackRate () {
  songs.playbackRate -= 0.5;
}
player = document.getElementById("audio-player-cont");

function OpenCloseMusic() {
  if (player.style.display === "none") {
    player.style.display = "block";
    localStorage.setItem('Mactive', 'opened');
  } else {
    player.style.display = "none";
    localStorage.setItem('Mactive', 'closed');
  }
}
