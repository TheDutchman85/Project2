/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
  audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  //B - add .onclick event to button
  playButton.onclick = e => {

    //check if context is in suspended state (autoplay policy)
    if(audio.audioCtx.state == "suspended"){
      audio.audioCtx.resume();
    }

    if(e.target.dataset.playing == "no"){
      //if track is currently paused, play it
      audio.playCurrentSound();
      canvas.startSpheres(true);
      e.target.dataset.playing = "yes"; //our css will set the text to "pause"
      //if the track IS playing, pause it
    }else{
      audio.pauseCurrentSound();
      canvas.startSpheres(false);
      e.target.dataset.playing = "no" //our css will set text to "play"
    }
  };
  
  //C - hookup volume slider & label
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel =  document.querySelector("#volumeLabel");

  //add .oninput event to slider
  volumeSlider.oninput = e => {
    //set the gain
    audio.setVolume(e.target.value);
    //update value of the label to match value of slider
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  }

  //set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input")); 

  //D - hookup track <select>
  let trackSelect = document.querySelector("#trackSelect");
  //add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    //pause the current track if it is playing
    if(playButton.dataset.playing == "yes"){
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };
} // end setupUI

function loop(){
  /* NOTE: This is temporary testing code that we will delete in Part II */
  requestAnimationFrame(loop);
  canvas.moveAndDrawSprites();
  canvas.draw();
}

export {init};