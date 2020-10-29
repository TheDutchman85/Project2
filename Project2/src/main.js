/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

//Imports
import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});
let inSession = true;

//The initial function to start the program
function init(){
  audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas");
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();
}

//To set up the UI
function setupUI(canvasElement){
  const fsButton = document.querySelector("#fsButton");
	
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };
  
  const reset = document.querySelector("#reset");
	
  // add .onclick event to the buttons
  reset.onclick = e => {
    console.log("init called");
    location.reload();
  };

  playButton.onclick = e => {
    if(audio.audioCtx.state == "suspended"){
      audio.audioCtx.resume();
    }

    if(e.target.dataset.playing == "no"){
      //if track is currently paused, play it
      audio.playCurrentSound();
      canvas.startSpheres(true);
      inSession = true;
      e.target.dataset.playing = "yes"; //our css will set the text to "pause"
      //if the track IS playing, pause it
    }else{
      audio.pauseCurrentSound();
      canvas.startSpheres(false);
      inSession = false;
      e.target.dataset.playing = "no" //our css will set text to "play"
    }
  };
  
  //Slider variables 
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel =  document.querySelector("#volumeLabel");
  let speedSlider = document.querySelector("#speedSlider");
  let speedLabel = document.querySelector("#speedLabel");
  let spawnSlider = document.querySelector("#spawnSlider");
  let spawnLabel = document.querySelector("#spawnLabel");

  //add .oninput event to slider
  volumeSlider.oninput = e => {
    //set the gain
    audio.setVolume(e.target.value);
    //update value of the label to match value of slider
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  }

  //set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input")); 

  //To set the speed
  speedSlider.oninput = e => {
    canvas.setSpeed(e.target.value);
    speedLabel.innerHTML = e.target.value;
  }

  speedSlider.dispatchEvent(new Event("input"));

  //To set the spawn
  spawnSlider.oninput = e => {
    canvas.setSpawn(e.target.value);
    spawnLabel.innerHTML = e.target.value;
  }

  spawnSlider.dispatchEvent(new Event("input"));

  let trackSelect = document.querySelector("#trackSelect");
  //add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    //pause the current track if it is playing
    if(playButton.dataset.playing == "yes"){
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  //To deal with the shelves
  document.querySelector('#highshelfCB').checked = audio.highshelf;

  document.querySelector('#highshelfCB').onchange = e => {
    audio.swapBoolH();
    audio.toggleHighshelf();
  };

  audio.toggleHighshelf();

  document.querySelector('#lowshelfCB').checked = audio.lowshelf; 

  document.querySelector('#lowshelfCB').onchange = e => {
    audio.swapBoolL();
    audio.toggleLowshelf(); 
  };

  audio.toggleHighshelf(); 
}

//The core loop
function loop(){
  /* NOTE: This is temporary testing code that we will delete in Part II */
  requestAnimationFrame(loop);
  if(inSession){
    canvas.moveAndDrawSprites();
    canvas.draw();
  }

  if(canvas.health <= 0)
  {
    audio.pauseCurrentSound();
    canvas.startSpheres(false);
  }
}

export {init};