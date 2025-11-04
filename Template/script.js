/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

// State variables are the parts of your program that change over time.

// Settings variables should contain all of the "fixed" parts of your programs

// Code that runs over and over again

//const list
const player= Util.createThing("player");
const size= 150;
const lowerVowels = ["a", "e", "i", "o", "u", "y", "å", "ä", "ö"];
const consonants=["b","c","d","f","g","h",
"j","k","l","m","n","p","q","r","s","t","v","w","x","z"]
const speed=0.01;
const shrinkFactor= 0.7;
const shrinkSize= size*shrinkFactor;
const offsetPixels= size-shrinkSize;
const offsetNormalized=offsetPixels/window.innerHeight;
const obstacleTypes=["smallJump","bigJump", "shrink"];
const shrinkTimeMax=1000;

player.style.zIndex="3"

//template for obstacles
const smallJump={
 color:[360,100,50,1],
size:[60,90],
 roundedness:0,
 y:0.85
}

const bigJump={
  color:[360,100,50,1],
  size:[110,160],
  roundedness:0,
  y:0.73
}

const shrink={
  color:[360,100,50,1],
  size:[200,185],
  roundedness:0,
  y:0.5
}

//variables
let x=0.1;
let y= 0.75;
let movingUp= false;
let jumpHeight=0;
let gameOver= false;
let shrinkTimer=0
let jumpPressStart=null;
let isJumping= false;
let peakHold=false;
let peakHoldTimer=null;

//obstacles array
let obstacles=[];


function initPlayer() {
Util.setPosition(x,y,player)
Util.setColour(120,100,50,1, player)
Util.setSize(size,size, player)
Util.setRoundedness(0.2, player)
}

function obstaclesAppear(){
  const typeSort= obstacleTypes[Math.floor(Math.random()*obstacleTypes.length)];

  let typeObject;
  if(typeSort==="smallJump") typeObject= smallJump;
  else if(typeSort==="bigJump") typeObject=bigJump;
  else if(typeSort==="shrink") typeObject=shrink;
  

  const obstacle= Util.createThing("obstacle");
  let x=1;
  Util.setPosition(x, typeObject.y, obstacle)
  Util.setColour(typeObject.color[0], typeObject.color[1],typeObject.color[2],
    typeObject.color[3], obstacle);
  Util.setSize(typeObject.size[0], typeObject.size[1], obstacle)
  Util.setRoundedness(typeObject.roundedness, obstacle)

  obstacles.push({
    thing:obstacle,
    x:x,
    y:typeObject.y,
    width: typeObject.size[0],
    height: typeObject.size[1],
    speed:0.005
  })
}

function collide
(playerX, playerY, playerWidth, playerHeight,obstacle){
  //the player edges
  const playerLeftEdge= playerX;
  const playerRightEdge= playerX+playerWidth;
  const playerTopEdge=playerY;
  const playerBottomEdge= playerY+playerHeight;

  //obstacle edges
  const obstacleLeftEdge=obstacle.x;
  const obstacleRightEdge=obstacle.x+(obstacle.width/window.innerWidth);
  const obstacleTopEdge=obstacle.y;
  const obstacleBottomEdge=obstacle.y+(obstacle.height/window.innerHeight);

  const overlapX=
  playerRightEdge>obstacleLeftEdge && playerLeftEdge<obstacleRightEdge;
  const overlapY=
  playerBottomEdge>obstacleTopEdge && playerTopEdge<obstacleBottomEdge;

  if(overlapX && overlapY)
    {
    return true; 
  } else{
    return false;

  }
}

function gameOverText(){
  const text= document.createElement("div");
  text.innerText="GAME OVER"
  text.style.fontSize="100px"
  text.style.position="fixed"
  text.style.top="30%"
  text.style.left="30%"
  document.body.appendChild(text)
}

function finishedGameText(){
  const text= document.createElement("div");
  text.innerText="Complete"
  text.style.fontSize="100px"
  text.style.position="fixed"
  text.style.top="30%"
  text.style.left="30%"
  document.body.appendChild(text)
}

document.addEventListener("keydown", (event)=>{
  if(lowerVowels.includes(event.key)&& !isJumping){
    if(jumpPressStart===null){
     
      jumpPressStart= Date.now()
      
    } 
  }
})

document.addEventListener("keyup", (event)=>{
  if(lowerVowels.includes(event.key)){
    if(jumpPressStart !== null && !isJumping){
      const pressDuration= Date.now()-jumpPressStart
      if(pressDuration < 200){
        jumpHeight= 0.15
      } else {
        jumpHeight=0.4
      } 
       movingUp=true;
       isJumping=true;
    }
      jumpPressStart=null 
   }
})

document.addEventListener("keydown",(event)=>{
  if(event.repeat)return;
if(consonants.includes(event.key)){
  if(!shrinkTimer){
    Util.setSize(size*shrinkFactor,size*shrinkFactor, player)
    movingUp=false;
    y+=offsetNormalized;
    Util.setPosition(x,y, player);
    shrinkTimer=setTimeout(()=>{
    Util.setSize(size,size,player)
    y-=offsetNormalized
    Util.setPosition(x,y,player);
    shrinkTimer=0;
   },shrinkTimeMax);
  }
 }
});

document.addEventListener("keyup", (event)=>{
  if(consonants.includes(event.key)){
    Util.setSize(size,size, player)
    y-=offsetNormalized;
  }
})
  
function loop() {
  if (gameOver) return
  const groundY= 0.75
  const jumpTargetY=groundY-jumpHeight

  if (movingUp){
    if(y>jumpTargetY){
      y-=speed;
       if(y<jumpTargetY) y=jumpTargetY;
    }else{
      movingUp=false;
      if(!peakHold){
        peakHold=true;
        peakHoldTimer=setTimeout(()=>{
          peakHold=false;
          peakHoldTimer=null;
        },800);

      }
    }
  }else if(peakHold){
    
  } else{
    if(y< groundY){
      y+=speed;
      if(y>groundY) y=groundY;
    } else{
      if(isJumping){
        isJumping=false;
        jumpHeight=0;
        if(peakHoldTimer){
          clearTimeout(peakHoldTimer);
          peakHoldTimer=null;
          peakHold=false;

        }
      }
    }
  }

  Util.setPosition(x,y, player);

  //obstacles movement
  for(let i=0; i<obstacles.length; i++){
    let obstacle=obstacles[i]
    obstacle.x-= obstacle.speed;
    Util.setPosition(obstacle.x, obstacle.y, obstacle.thing);
  
  //collision
  const playerX=x;
  const playerY=y;
  const playerWidth= size/window.innerWidth;
  const playerHeight= size/window.innerHeight;
  
  if (collide (playerX, playerY, playerWidth, playerHeight, obstacle)){
    console.log("Game over")
    gameOver=true;
    gameOverText()
    return;
  }
 } window.requestAnimationFrame(loop);
}
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
 initPlayer()
 obstaclesAppear()
 setInterval(obstaclesAppear, 2500);
 
  // Put your event listener code here

  window.requestAnimationFrame(loop);
}
setup(); // Always remember to call setup()!

 document.body.removeChild(Util.thing)
