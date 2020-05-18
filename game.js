let rocket;
let bullet;
let bulletGroup;
let comet;
let cometGroup;
let ufo;
let ufoGroup;
let catcher; //для подсчета пропущенных НЛО
let score = 0;
let x1 = 0; //положение первого изображения фона
let x2;    //положение второго изображения фона
let scrollSpeed; //скорость движения фона
let acceleration_bg = 0; //для ускорения с течением времени
let acceleration = 0;
let gameStatus = "start"; 
let timeInGame = 0;


function preload(){
    //картинки
	bgImg = loadImage('assets/bg.png');
    rocketImg = loadImage('assets/rocket.svg');
    bulletImg = loadImage('assets/bullet.svg');
    ufoImg = loadImage('assets/ufo.svg');
    asteroidImg1 = loadImage('assets/asteroid-01.png');
    asteroidImg2 = loadImage('assets/asteroid-02.png');
    asteroidImg3 = loadImage('assets/asteroid-03.png');
    asteroidImg4 = loadImage('assets/asteroid-04.png');
  
    //шрифты
    pixFont = loadFont('assets/PressStart2P-Regular.ttf');
  
    //звуки
    shotSound = loadSound('assets/blaster.mp3');
    failSound = loadSound('assets/fail.mp3');
  
}

function setup(){

    createCanvas(windowWidth, windowHeight);
    x2 = width;  
}

function mousePressed(){  //выстрел по нажатию ЛКМ
	if (gameStatus == "running"){
      bullet = createSprite(rocket.position.x, rocket.position.y);
      bullet.velocity.x = 15;
      bullet.addImage(bulletImg);
      bullet.scale = 0.3;
      bullet.setCollider('rectangle', 0, 0, 120, 30);
      bullet.depth = 0;
      if (bullet.position.x > windowWidth){
        bullet.remove()
      }
      bulletGroup.add(bullet);
      shotSound.setVolume(0.2);
      shotSound.play();
    }
    else if (gameStatus == "over"){
      gameStatus = "running";
      runGame();
    }
}

function draw() {
    if (gameStatus == "start"){
      startGame();
    }
    else if (gameStatus == "running"){
    clear();
    drawBackground();
    drawSprites();
    rocket.position.x = mouseX;
    rocket.position.y = mouseY;
    rocket.collide(cometGroup, gameOver);
    rocket.collide(ufoGroup, gameOver);
    bulletGroup.overlap(ufoGroup, removeUfo);
    ufoGroup.displace(cometGroup);
    ufoGroup.overlap(catcher, removeLostUfo);
    if (gameStatus == "running"){
      textFont(pixFont, 30);
      fill(240, 200, 0);
      text(score, 30, 50);
    }
    if (score < 0){
      gameOver();
    }
    scrollSpeed+=acceleration_bg; //ускорение движения фона
    acceleration_bg+=0.000001; 
    acceleration+=0.01;  //ускорение движения объектов
  } 
}

function drawBackground(){ //отрисовка движения бесшовного фона

    x1 -= scrollSpeed;
    x2 -= scrollSpeed;
    if (x1 <= -width){
      x1 = width;
    }
    if (x2 < -width){
      x2 = width;
    }
    image(bgImg, x1, 0, width + scrollSpeed, height); 
    image(bgImg, x2, 0, width + scrollSpeed, height);
}

function generateComets() { //встречные кометы
  comet = createSprite(windowWidth+200, random(50, height-50));
  let sc = random(0.1, 0.4)
  comet.scale = sc;
  comet.setCollider('circle', 0, 0, 200);
  imgNum = Math.floor(random(1, 5));
  switch(imgNum) {
  case 1:
    asteroidImg = asteroidImg1;
      break;
  case 2: 
    asteroidImg = asteroidImg2; 
      break;
  case 3: 
    asteroidImg = asteroidImg3;
      break;
  default: 
    asteroidImg = asteroidImg4;
      break;
  }
  comet.addImage(asteroidImg);
  comet.velocity.x = random(-10-acceleration, -5-acceleration);
  comet.life = 1000;
  cometGroup.add(comet);
  //comet.debug = true;
}

function generateUfo() { //встречные НЛО
  ufo = createSprite(windowWidth+200, random(100, height-100));
  let sc = random(0.4, 1.2);
  ufo.scale = sc;
  ufo.setCollider('circle', 0, 0, 70);
  ufo.addImage(ufoImg);
  ufo.velocity.x = random(-10-acceleration, -5-acceleration);
  ufoGroup.add(ufo);
}

function removeUfo(ufo, bullet){
  ufo.remove();
  bullet.remove();
  score++;
}

function removeLostUfo(ufo){
  ufo.remove();
  score--;
}

function startGame(){
  push();
  image(bgImg, 0, 0, width, height); 
  pop();

  textFont(pixFont, 40);
  fill(240, 200, 0);
  text( "Click to start", width/2 - 280, height/2 - 250);
  
  textFont(pixFont, 20);
  text( "- Avoid any collisions", width/2 - 360, height/2 - 100);
  text( "- Every killed UFO gives 1 point", width/2 - 360, height/2 + 0);
  text( "- Every lost UFO takes away 1 point", width/2 - 360, height/2 + 100);
  fill(250, 10, 10);
  text( "TRY NOT TO GO NEGATIVE", width/2 - 225, height/2 + 250);
  text( "AND HOLD OUT AS LONG AS POSSIBLE", width/2 - 310, height/2 + 300);

  if (mouseIsPressed) {
    runGame();
  }
}

function runGame(){
    x1 = 0;
    x2 = width;
  
    rocket = createSprite(mouseX, mouseY, 200);
    rocket.addImage(rocketImg);
    rocket.scale = 0.7;
    rocket.setCollider('rectangle', 0, 0, 130, 70);
    
    cometGroup = new Group();
    bulletGroup = new Group();
    ufoGroup = new Group();
    comet = createSprite(windowWidth+200, random(50, width-50));
    cometGroup.add(comet);
    bullet = createSprite(rocket.position.x - 1000, rocket.position.y);
    bullet.scale = 0;
    bullet.life = 1;
    bulletGroup.add(bullet);
    ufo = createSprite(windowWidth+200, random(50, width-50));
    ufoGroup.add(ufo);
    catcher = createSprite(-200, windowHeight/2, 10, windowHeight);
    
    score = 0;
    scrollSpeed = 3;
    acceleration_bg = 0;
    acceleration = 0;
    timeInGame = 0;

    intervalComets = setInterval(generateComets, 1000);
    intervalUfo = setInterval(generateUfo, 800);
    intervalTimer = setInterval(addTime, 10);
    gameStatus = "running";
} //без демонстрации стартового экрана


function gameOver(){
  cometGroup.removeSprites();
  bulletGroup.removeSprites();
  ufoGroup.removeSprites();
  rocket.remove();
  clearInterval(intervalComets);
  clearInterval(intervalUfo);
  clearInterval(intervalTimer);
  gameStatus = "over";
  
  failSound.play();

  image(bgImg, x1, 0, width, height);
  image(bgImg, x2, 0, width, height);
  fill(250, 10, 10);
  textFont(pixFont, 50);
  text("GAME OVER", width/2 - 230, height/2 - 150);
  
  print(timeInGame);
  let t = timeInGame/1000;
  
  fill(240, 200, 0);
  textFont(pixFont, 35);
  text("Your time in game:" + t.toString(), width/2 - 350, height/2 + 50);
  textFont(pixFont, 20);
  text("(Score:" + score.toString() + ')', width/2 - 90, height/2 + 130);
  text("Click to restart", width/2 - 160, height/2 + 200);
}

function addTime(){
  timeInGame+=10;
}