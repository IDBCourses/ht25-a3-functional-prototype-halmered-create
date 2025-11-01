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
//smallJump.style.zIndex="1"
//bigJump.style.zIndex="2"
player.style.zIndex="3"


//const obstacle= Util.createThing("obstacle")

let smallJump={
color:[360,100,50,1],
size:[60,60],
roundedness:0,
y:0.9
}

let bigJump={
  color:[360,100,50,1],
  size:[150,70],
  roundedness:0,
  y:0.9
}

//let shrink={
  //color:[360]

//}

//player location and state
let x=0.1;
let y= 0.75;
let movingUp= false;
let jumpHeight=0;



let obstacles=[

]




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
    speed:0.009
  })
}

function collide
(playerX, playerY, playerWidth, playerHeight,obstacle){
  let playerRightEdge= playerX+playerWidth;
  if(obstacle.x<=playerRightEdge){
    return true;
  }
  return false;
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
  //player movement
  if(movingUp&& y>0.75 - jumpHeight){
    y-=speed
  } else if (!movingUp && y< 0.75){
    y+=speed
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
  const objectWidth= obstacle.width/window.innerWidth;
  const objectHeight=obstacle.height/window.innerHeight ;

  if (collide (playerX, playerY, playerWidth, playerHeight, obstacle)){
    break
    //window.alert("game over")
    
  }

  

  }




  
  window.requestAnimationFrame(loop);
}


// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
 initPlayer()
 obstaclesAppear()
 setInterval(obstaclesAppear, 2000);

  
  // Put your event listener code here

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!

 document.body.removeChild(Util.thing)
