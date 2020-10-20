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

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;
let sprites = [];
let inSession = false;
let player = new classe.Sprite(25,25,15, utils.getRandomUnitVector(),3,"white");
let w = false;
let a = false;
let s = false;
let d = false;
let points = 0;
let invertBool = false;
let hitCount = 60;

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
}

function draw(){
    // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
    ctx.save();
    ctx.fillstyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
    if(true){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
    
    // 5 - draw circles
    let maxRadius = canvasHeight/4;
    ctx.save();
    ctx.globalAlpha = 0.5;

    for(let i = 0; i < audioData.length; i++){
        //red-ish circles
        let percent = audioData[i] / 255;
        let circleRadius = percent * maxRadius;
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
        //console.log(audioData);
        //console.log(counter);
        if(audioData[i] < 61 && audioData[i] > 1 && inSession)
        {
            //console.log("Hit");
            let s = new classe.RingSprite(canvasWidth/2, canvasHeight/2, 15 + (1 - percent) * 10, utils.getRandomUnitVector(),Math.random() + 2, utils.getRandomColor());
            //console.log(s);
            sprites.push(s);
            //console.log(sprites);
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

    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // the variable `data` below is a reference to that array 
    let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;    //not using here
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for(let i = 0; i < length; i +=4){
		// C) randomly change every 20th pixel to red
        //if(params.showNoise && Math.random() < 0.05){
		//	// data[i] is the red channel
		//	// data[i+1] is the green channel
		//	// data[i+2] is the blue channel
		//	// data[i+3] is the alpha channel
		//	data[i] = data[i+1] = data[i+2] = 0;// zero out the red and green and blue channels
		//	data[i+2] = 255;// make the red channel 100% red
        //} // end if
        
        //Inverting the colors
        if(invertBool){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;        //set red
            data[i+1] = 255 - green;    //set green
            data[i+2] = 255 - blue;     //set blue
        }
    } // end for
    
    ////Emboss
    //if(params.showEmboss){
    //    for(let i = 0; i < length; i++){
    //        if(i%4==3) continue;    //if alpha channel
    //        data[i] = 127 + 2*data[i] - data[i+4] - data[i + width*4];
    //    }
    //}
	
    // D) copy image data back to canvas
    ctx.putImageData(imageData, 0 ,0);
}

function moveAndDrawSprites(){
    checkCollisions();
    ctx.save();
    for (let s of sprites){
        // move sprite
        s.move();
        
        // check sides and bounce
        if (s.x <= s.span/2 || s.x >= canvasWidth-s.span/2){
            //s.reflectX();
            //s.move();
            let index = sprites.indexOf(s);
            sprites.splice(index, 1);
        }
        if (s.y <= s.span/2 || s.y >= canvasHeight-s.span/2){
            //s.reflectY();
            //s.move();
            let index = sprites.indexOf(s);
            sprites.splice(index, 1);
        }
  
        // draw sprite
        s.draw(ctx);
  
    } // end for

    player.draw(ctx);

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
            points += 1;
            invertBool = true;
            document.querySelector("#points").innerHTML = "Points: " + points;
        }
    }
}

function startSpheres(value)
{
    inSession = value;
}

export {setupCanvas,draw,moveAndDrawSprites,startSpheres};