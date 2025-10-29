/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";



// State variables are the parts of your program that change over time.

// Settings variables should contain all of the "fixed" parts of your programs

// Code that runs over and over again

const player= Util.createThing("player");
const size= 150;
const lowerVowels = ["a", "e", "i", "o", "u", "y", "å", "ä", "ö"];
const capitalVowels = ["A", "E", "I", "O", "U", "Y", "Å", "Ä", "Ö"];
const allVowels = 
["a", "e", "i", "o", "å", "ä", "ö","u","y", "A", "E", "I", "O","Å","Ä","Ö","U","Y"];
const consonants=["B","b","C","c","D","d","F","f","G","g","H","h","J",
  "j", "K","k", "L","l","M","m","N","n","P","p","Q","q","R","r","S","s","T",
  "t","V","v","W","w","X","x","Z","z"]
const speed=0.07
const shrinkFactor= 0.7
const shrinkSize= size*shrinkFactor
const offsetPixels= size-shrinkSize
const offsetNormalized=offsetPixels/window.innerHeight
const obstacleTypes=["smallJump","bigJump","shrink" ];
//const obstacle= Util.createThing("obstacle")
let smallJump={
color:[360,100,50,1],
size:[60,60],
roundedness:[0],
y:[0.8]}

let bigJump={
  color:[360,100,50,1],
  size:[150,70],
  roundedness:[0]
}

let shrink={
  color:[]

}

//player location and state
let x=0.1;
let y= 0.75;
let movingUp= false;
let jumpHeight=0;



let obstacles=[]




function initPlayer() {
Util.setPosition(x,y,player)
Util.setColour(120,100,50,1, player)
Util.setSize(size,size, player)
}

document.addEventListener("keydown", (event)=>{
  if(lowerVowels.includes(event.key)){
    movingUp=true;
    jumpHeight=0.2;}
    else if (capitalVowels.includes(event.key)) {
    movingUp=true;
    jumpHeight=0.4;}

    
})


document.addEventListener("keyup", (event)=>{
  if(allVowels.includes(event.key))
    movingUp=false;

})

document.addEventListener("keydown",(event)=>{
if(consonants.includes(event.key)){
  Util.setSize(size*shrinkFactor,size*shrinkFactor, player)
  movingUp=false;
  y+=offsetNormalized;

}
})

document.addEventListener("keyup", (event)=>{
  if(consonants.includes(event.key)){
    Util.setSize(size,size, player)
    y-=offsetNormalized;
  }
}
)
  
function loop() {
  if(movingUp&& y>0.75 - jumpHeight){
    y-=speed
  } else if (!movingUp && y< 0.75){
    y+=speed
  }
  Util.setPosition(x,y, player);
  
  window.requestAnimationFrame(loop);
}


// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
 initPlayer()

  
  // Put your event listener code here

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!

 document.body.removeChild(Util.thing)
