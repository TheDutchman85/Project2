/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as classe from './classes.js';

//Variables
let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;
let sprites = [];
let wave = [];
let wave2 = [];
let inSession = false;
let playing = true;
let player = new classe.Sprite(25,25,15, utils.getRandomUnitVector(),3,"white");
let w = false;
let a = false;
let s = false;
let d = false;
let health = 5;
let invertBool = false;
let hitCount = 60;
let speedStart, spawnB = 60, spawnT = 225;

//to set up the canvas
function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"MidnightBlue"},{percent:.35,color:"red"},{percent:.5,color:"yellow"},{percent:.65,color:"red"},{percent:1,color:"MidnightBlue"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize/2);

    setSpeed(2.5);
    waves();
}

//To draw to the canvvas all the elements
function draw(){
    if(health <= 0){
        health = 0;
        playing = false;
        document.querySelector("#gameOver").innerHTML = "GAME OVER";
        document.querySelector("#points").innerHTML = "Health: 0";
    }

	analyserNode.getByteFrequencyData(audioData);
    
    //Background
    ctx.save();
    ctx.fillstyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();

	//Gradient
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
    
    let maxRadius = canvasHeight/4;
    ctx.save();
    ctx.globalAlpha = 0.5;

    //Middle orb
    for(let i = 0; i < audioData.length; i++){
        
        //red-ish circles
        let percent = audioData[i] / 255;
        let circleRadius = percent * maxRadius;/*
        ctx.beginPath();
        ctx.fillStyle = utils.makeColor(255,111,111,.34 - percent/3.0);
        ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
        //blue-ish circles, bigger, more transparent
        ctx.beginPath();
        ctx.fillStyle = utils.makeColor(0,0,255, .10 - percent/10.0);
        ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
        //yellow-ish circles, smaller
        ctx.beginPath();
        ctx.fillStyle = utils.makeColor(200,200,0, .5 - percent/5.0);
        ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 0.5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
*/
        ctx.save();
        ctx.fillStyle = utils.makeColor(255,111,111,.34 - percent/3.0);
        ctx.beginPath();
        ctx.rect(canvasWidth/2 -circleRadius/2, canvasHeight/2 -circleRadius/2,circleRadius,circleRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        circleRadius = circleRadius * 1.5;
        ctx.save();
        ctx.fillStyle = utils.makeColor(200,200,0, .5 - percent/5.0);
        ctx.beginPath();
        ctx.rect(canvasWidth/2 -circleRadius/2, canvasHeight/2 -circleRadius/2,circleRadius,circleRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        circleRadius = circleRadius / 1.5;

        circleRadius = circleRadius * 2;
        ctx.save();
        ctx.fillStyle = utils.makeColor(0,0,255, .10 - percent/10.0);
        ctx.beginPath();
        ctx.rect(canvasWidth/2 -circleRadius/2, canvasHeight/2 -circleRadius/2,circleRadius,circleRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
         /*
        let temp = circleRadius * 1.5;
        ctx.save();
        ctx.fillStyle = utils.makeColor(0,0,255, .10 - percent/10.0);
        ctx.beginPath();
        ctx.rect(canvasWidth/2 -circleRadius/2, canvasHeight/2 -circleRadius/2,circleRadius,circleRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = utils.makeColor(0,0,255, .10 - percent/10.0);
        ctx.beginPath();
        ctx.rect(canvasWidth/2 -circleRadius/2, canvasHeight/2 -circleRadius/2,circleRadius * 0.5,circleRadius * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();*/

        //Spawning of the circles if the frequency goes low (bass)
        if(audioData[i] < spawnB && audioData[i] > 10 && inSession)
        {
            console.log(spawnB);
            let s = new classe.RingSprite(canvasWidth/2, canvasHeight/2, 15 + (1 - percent) * 10, utils.getRandomUnitVector(), speedStart, utils.getRandomColor());
            sprites.push(s);
        }
        //Spawning of the circles if the frequency goes up (treble)
        if(audioData[i] > spawnT && audioData[i] > 10 && inSession && Math.random() < .025)
        {
            let s = new classe.RingSprite(canvasWidth/2, canvasHeight/2, 15 + (1 - percent) * 10, utils.getRandomUnitVector(), speedStart, utils.getRandomColor());
            sprites.push(s);
        }
    }
    ctx.restore();

    if(invertBool){
        hitCount --;
    }

    if(hitCount < 0){
        hitCount = 60;
        invertBool = false;
    }

    //Bitmap manipulation
    let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;    

    for(let i = 0; i < length; i +=4){     
        //Inverting the colors
        if(invertBool){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;        //set red
            data[i+1] = 255 - green;    //set green
            data[i+2] = 255 - blue;     //set blue
        }
    }
	
    ctx.putImageData(imageData, 0 ,0);
}

//To move all the current sprites
function moveAndDrawSprites(){
    checkCollisions();
    ctx.save();
    for (let s of sprites){
        // move sprite
        s.move();
        
        // check sides and bounce
        if (s.x <= s.span/2 || s.x >= canvasWidth-s.span/2){
            let index = sprites.indexOf(s);
            sprites.splice(index, 1);
        }
        if (s.y <= s.span/2 || s.y >= canvasHeight-s.span/2){
            let index = sprites.indexOf(s);
            sprites.splice(index, 1);
        }
  
        // draw sprite
        s.draw(ctx);
    }

    ctx.save();
    ctx.globalAlpha = 0.3;

    //Draw the waves
    for(let w of wave){
        w.draw(ctx);
    }
    for(let w of wave2){
        w.draw(ctx);
    }

    //Set the wave heights
    for(let i = 0; i < audioData.length; i++){
        wave[i].y = 384 - audioData[i];
        wave2[i].y = audioData[i];
    }
    ctx.restore();

    player.draw(ctx);

    //Player input bools
    document.addEventListener('keydown', function(event) {
        if(event.key == "w") {
            w = true;
        }
        else{
            w = false;
        }
        if(event.key == "a") {
            a = true;
        }
        else{
            a = false;
        }
        if(event.key == "s") {
            s = true;
        }
        else{
            s = false;
        }
        if(event.key == "d") {
            d = true;
        }
        else{
            d = false;
        }
    }); 

    //Player input movement
    if(playing){
        if(w){
            player.y -= player.speed;
        }
        if(a){
            player.x -= player.speed;
        }
        if(s){
            player.y += player.speed;
        }
        if(d){
            player.x += player.speed;
        }
    }

    // check sides and move the player in the opposite direction
    if (player.x <= player.span/2){
        player.x += player.speed;
    }
    if(player.x >= canvasWidth-player.span/2){
        player.x -= player.speed;
    }
    if (player.y <= player.span/2){
        player.y += player.speed;
    }
    if(player.y >= canvasHeight-player.span/2){
        player.y -= player.speed;
    }

    ctx.restore();
}

//To see if the player is colliding with a circle
function checkCollisions(){
    for (let s of sprites){
        let playerRadius = player.span/2;
        let circleRadius = s.span/2
        let difY = player.y - s.y;
        let difX = player.x - s.x
        let distance = Math.sqrt(difX*difX + difY * difY);
        let sum = playerRadius + circleRadius;

        if(distance <= sum)
        {
            let index = sprites.indexOf(s);
            sprites.splice(index, 1);
            health -= 1;
            invertBool = true;
            document.querySelector("#points").innerHTML = "Health: " + health;
        }
    }
}

//To start the sphere spawning
function startSpheres(value){
    inSession = value;
}

//To set the speed of the circles
function setSpeed(value){
    speedStart = value;
}

//To set the spawn rate
function setSpawn(value){
    if(value < 0)
    {
        for(let i = 0; i < Math.abs(value); i++){
            spawnB --;
            spawnT --;
        }
    }else{
        for(let i = 0; i < Math.abs(value); i++){
            spawnB ++;
            spawnT ++;
        }
    }
}

//To create the waves
function waves(){
    let delta = canvasWidth / audioData.length;
    for(let i = 0; i < audioData.length; i++){
        let w = new classe.WholeRingSprite(delta * i, canvasHeight/2, 15, {x:0,y:1}, 0, "rgb(255,0,0)");
        let w2 = new classe.WholeRingSprite(delta * i, canvasHeight/2, 15, {x:0,y:1}, 0, "rgb(255,0,0)");
        wave.push(w);
        wave2.push(w2);
    }
}

export {setupCanvas,draw,moveAndDrawSprites,startSpheres, health, setSpeed,setSpawn};