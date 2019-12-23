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

  audio;

  constructor() {
    this.audio = new Audio();
  }

  ngOnInit() {}

  filesPicked(files) {
    for (let i = 0; i < files.length; i++) {
      let path = files[i].webkitRelativePath;

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
    if (localStorage.getItem('index') != null) {
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

    //setting icons and displaying name and audio bar
    this.currentSongName=this.musicFiles[index].name;
    this.isPlaying = true;
    this.showBar = true;
  }

  //function for pausing songs
  pauseClick() {
    this.isPlaying = false;
    this.audio.pause();
  }
  //function for resuming song{
  playClick() {
    this.isPlaying = true;
    this.audio.play();
  }
  //for playing previous song
  playPrevious() {
    if (this.index > 0) {
      this.play(--this.index);
    }
    else{
      this.index=this.musicList.length-1;
      this.play(this.index);
    }
  }
  //for playing next song
  playNext(){
    this.index++;
    if(this.index < this.musicList.length){
      this.play(this.index);
    }
    else{
      this.index=0;
      this.play(this.index);
    }
  }
}
