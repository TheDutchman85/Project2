"use strict";
//Create a default sprite
class Sprite{
    constructor(x=0,y=0,span=10,fwd={x:1,y:0},speed=0,color="black"){
        this.x = x;
        this.y = y;
        this.span = span;
        this.fwd = fwd;
        this.speed = speed;
        this.color = color;
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.beginPath();
        ctx.rect(-this.span/2,-this.span/2,this.span, this.span);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    move(){
        this.x += this.fwd.x * this.speed;
        this.y += this.fwd.y * this.speed;
    }

    reflectX(){
        this.fwd.x *= -1;
    }

    reflectY(){
        this.fwd.y *= -1;
    }
}

//create a dignut sprite based on the default
class RingSprite extends Sprite{
    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.beginPath();
        ctx.arc(0,0,this.span/2,0,Math.PI * 2,false);
        ctx.arc(0,0,this.span/4,0,Math.PI * 2,true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    
}

//create a circle sprite based on the default
class WholeRingSprite extends Sprite{
    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.beginPath();
        ctx.arc(0,0,this.span/2,0,Math.PI * 2,false);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    
}

export {Sprite, RingSprite,WholeRingSprite};