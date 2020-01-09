import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.css"]
})
export class MainPageComponent implements OnInit {
  musicList = [];
  musicFiles = [];

  hideImport = false;
  showBar = false;

  //indicates that song is playing
  isPlaying = false;

  //current index for further use such as rewinding and forwarding
  index = 0;
  currentSongName;
  currentSongDuration;

  audio;

  //loading interval
  loadingInterval;
  loadingBar;
  width;
  formula;

  //playlist
  playlist = [];

  constructor() {
    this.audio = new Audio();
  }

  ngOnInit() {}

  filesPicked(files) {
    for (let i = 0; i < files.length; i++) {
      //check extention if it is mp3 or not
      if (files[i].type == "audio/mp3") {
        //create url used for audio from relative path
        const url = URL.createObjectURL(files[i]);

        this.musicList.push(url);
        this.musicFiles.push(files[i]);
      }
    }

    //to hide choose file button
    this.hideImport = true;
  }

  calSize(size) {
    size = size / 1024;
    return (size / 1024).toFixed(2);
  }

  //for playing the music
  play(index) {
    //will save previous song's id in localstorage and will remove playing icon
    if (localStorage.getItem("index") != null) {
      document.getElementById(localStorage.getItem("index")).style.display =
        "none";
    }
    //enable playing icon
    localStorage.setItem("index", index);
    document.getElementById(index).style.display = "block";

    //actually playing the audio
    this.index = index;
    this.audio.src = this.musicList[index];
    this.audio.play();

    //adding a event listener because audio and video playback are asynchronous tasks and will run
    //asynchronously therefore they can't be displayed using alert or console,
    //used loadmetadata so that when song is loaded in memory it will get triggered and fetch me duration
    this.audio.addEventListener("loadedmetadata", () => {
      let duration = this.audio.duration;
      this.currentSongDuration = (duration / 60).toFixed(2);

      //setting loading bar
      this.loadingBarPlay(duration);
    });

    //setting icons and displaying name and audio bar
    this.currentSongName = this.musicFiles[index].name;
    this.isPlaying = true;
    this.showBar = true;
  }

  //to control loading bar
  loadingBarPlay(duration) {
    this.loadingBar = document.getElementById("loading");
    this.width = 0;
    this.formula = 100 / duration;

    //clear all interval first
    //setTimeout(;) will gives the highest interval id and then clear all
    //intervals to that highest timeout
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }

    //work untill music is played
    this.loadingInterval = this.intervalForLoading();
  }
  intervalForLoading() {
    var interval = setInterval(() => {
      if (this.width >= 100) {
        clearInterval(interval);

        //if audio is ended switch to next one
        if (this.audio.ended) {
          //check whether the playlist is made or not
          //if the playlist is empty then play next, if playlist is not empty then get index of playlist
          //and play that music
          if (this.playlist.length == 0) {
            this.playNext();
          } else {
            this.play(this.playlist.shift());
          }
        }
      }

      this.width += this.formula;
      //setting width
      this.loadingBar.style.width = this.width + "%";
    }, 1000);

    return interval;
  }

  //function for pausing songs
  pauseClick() {
    this.isPlaying = false;
    this.audio.pause();

    clearInterval(this.loadingInterval);
  }
  //function for resuming song{
  playClick() {
    this.isPlaying = true;
    this.audio.play();

    this.loadingInterval = this.intervalForLoading();
  }
  //for playing previous song
  playPrevious() {
    if (this.index > 0) {
      this.play(--this.index);
    } else {
      this.index = this.musicList.length - 1;
      this.play(this.index);
    }
  }
  //for playing next song
  playNext() {
    this.index++;
    if (this.index < this.musicList.length) {
      this.play(this.index);
    } else {
      this.index = 0;
      this.play(this.index);
    }
  }

  //for adding in playlist
  addToPlaylist(index) {
    this.playlist.push(index);
    console.log(this.playlist);
  }

  //for adding in front of queue
  playNextFromPlaylist(index) {
    this.playlist.unshift(index);
    console.log(this.playlist);
  }
}
