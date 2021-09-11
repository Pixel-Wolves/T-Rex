var PLAY = 1;
var END = 0;
var gameState = PLAY;

var jumpSound, dieSound, checkPointSound;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var obstacleAppear = 60, groundVelocity = -10;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver, restart;
var gO_Image, restart_Image;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gO_Image = loadImage("gameOver.png");
  restart_Image = loadImage("restart.png");
  
  jumpSound = loadSound("jump.wav");
  dieSound = loadSound("die.wav");
  checkPointSound = loadSound("point.wav");
}

function setup() {
  createCanvas(600, 200);
  
  gameOver = createSprite(300,100, 100, 100);
  gameOver.addImage(gO_Image);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,140, 100, 100);
  restart.addImage(restart_Image);
  restart.scale = 0.5;
  restart.visible = false;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;
  trex.frameDelay = 2;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -10;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello" + 5);
  trex.setCollider("circle", 0, 0, 40);
  trex.debug=false;
  score = 0;
}

function draw() {
  background("White");
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = groundVelocity;
    score += Math.round(getFrameRate()/60);
    
    if(score % 100 === 0 && score > 0){
      checkPointSound.play();
      groundVelocity -= 0.5;
      obstacleAppear -= 5;
    }
    
    // Loop ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    // Jump
    if(trex.y >= 160) {
      trex.play();
      
      if(keyDown("space")){
        trex.velocityY = -23;
        jumpSound.play();
      }
    }
    else{
      trex.pause();
    }
    
    // Gravity
    trex.velocityY = trex.velocityY + 2.5
    
    obstaclesGroup.setVelocityXEach(groundVelocity);
    
    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();
    
    // End Game
    if(obstaclesGroup.isTouching(trex)){
      gameOver.visible = true;
      restart.visible = true;
      dieSound.play();
      gameState = END;
    }
  }
  else if(gameState === END){
    //stop the ground
    trex.velocityY = 0;
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided");
    
    if(mousePressedOver(restart) || keyIsDown("space")){
      score = 0;
      groundVelocity = -10;
      obstacleAppear = 60;
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
      trex.y = 180;
      trex.changeAnimation("running");
      gameOver.visible = false;
      restart.visible = false;
      gameState = PLAY;
    }
  }  
  
  trex.collide(invisibleGround);

  drawSprites();
}

function spawnObstacles(){
 if (frameCount % obstacleAppear === 0){
   var obstacle = createSprite(615,165,10,40);
   obstacle.velocityX = groundVelocity;
   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
}

