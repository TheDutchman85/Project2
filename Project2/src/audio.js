/*
This .js is used to create audio aspects for the program
*/

//Variables to be used in the audio.js
let audioCtx;
let element, sourceNode, analyserNode, gainNode, buffer, biquadFilter, lowShelfBiquadFilter, highshelf, lowshelf;

const DEFAULTS = Object.freeze({
    gain         :       0.5,
    numSamples   :       256                 
});

let audioData = new Uint8Array(DEFAULTS.numSamples/2);

//Setting up the audio
function setupWebaudio(filePath){
    //getting the context
    const AudioContext = window.AudioContext || window.webkitAudioContext; 
    audioCtx = new AudioContext();
    
    //Creating elements and nodes
    element = new Audio();

    loadSoundFile(filePath);
    
    sourceNode = audioCtx.createMediaElementSource(element);

    buffer = audioCtx.createBuffer(1, 22050, 44100);
    
    analyserNode = audioCtx.createAnalyser();

    lowShelfBiquadFilter = audioCtx.createBiquadFilter();
	lowShelfBiquadFilter.type = "lowshelf";

    biquadFilter = audioCtx.createBiquadFilter();
	biquadFilter.type = "highshelf";
    
    analyserNode.fftSize = DEFAULTS.numSamples;
    
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;
    
    //Connecting the nodes
    sourceNode.connect((biquadFilter));
    biquadFilter.connect(lowShelfBiquadFilter);
    lowShelfBiquadFilter.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    //Turning off the shelves
    highshelf = false;
    lowshelf = false;
}

//To load in a sound file
function loadSoundFile(filePath){
    element.src = filePath;
}

//To play a sound
function playCurrentSound(){
    element.play();
}

//To pause a sound
function pauseCurrentSound(){
    element.pause();
}

//To set the volume
function setVolume(value){
    value = Number(value);
    gainNode.gain.value = value;
}

//To toggle on the highShelf
function toggleHighshelf(){
    if(highshelf){
        biquadFilter.frequency.setValueAtTime(50, audioCtx.currentTime);
        biquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    }else{
        biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

//To toggle the lowShelf
function toggleLowshelf(){
    if(lowshelf){
        lowShelfBiquadFilter.frequency.setValueAtTime(400, audioCtx.currentTime);
        lowShelfBiquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    }else{
        lowShelfBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

//To swap the highShelf bool
function swapBoolH(){
    if(highshelf){
        highshelf = false;
    }else{
        highshelf = true;
    }
}

//To swap the lowShelf bool
function swapBoolL(){
    if(lowshelf){
        lowshelf = false;
    }else{
        lowshelf = true;
    }
}

export {audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode, toggleHighshelf, toggleLowshelf, swapBoolH, swapBoolL};