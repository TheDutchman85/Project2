console.log("Loaded");

(function(){
    "use strict";
    let ldvLIB = {
        //To get a random color
        getRandomColor(){
            const getByte = _ => 55 + Math.round(Math.random() * 200);
            //return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",.8)";
            return `rgba(${getByte()}, ${getByte()}, ${getByte()},.8)`;
        },
        
        //To get a random int
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min; 
        },
        
        //To draw a rectangle in canvas
        drawRectangle(ctx,x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black"){
            ctx.save();
            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.rect(x,y,width,height);
            ctx.closePath();
            ctx.fill();
            if(lineWidth > 0){
              ctx.strokeStyle = strokeStyle;
              ctx.lineWidth = lineWidth;
              ctx.stroke();
            }
            ctx.restore();
        },

        //To get the mouse position on the canvas in canvas coordinates
        getMousePosition(canvas, event) { 
            let rect = canvas.getBoundingClientRect(); 
            let x = event.clientX - rect.left; 
            let y = event.clientY - rect.top; 
            let coords = [x,y];
            return coords;
        },

        //To have an object chase another
        chasePosition(chaserLocationX, chaserLocationY, newLocationX, newLocationY){
            if(chaserLocationX < newLocationX){
                chaserLocationX ++;
            }else if(chaserLocationX > newLocationX){
                chaserLocationX --;
            }
            if(chaserLocationY < newLocationY){
                chaserLocationY ++;
            }else if(chaserLocationY > newLocationY){
                chaserLocationY --;
            }

            let coords = [chaserLocationX,chaserLocationY];
            return coords;
        }
    };

    if(window){
        window["ldvLIB"] = ldvLIB;
    }
    else{
        throw "'window' is not defined!"
    }
})();