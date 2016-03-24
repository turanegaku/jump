var hiscore = 0;
var score = 0;
var raccoon;

var raccoonX = 50;
var raccoonY = 300;
var racconV = 10;
var SIZE = 100;

var raccoondy = 0;
var raccoonv = 0;
var raccoonjump = false;

var TITLE = 0;
var GAME = 1;

var step = TITLE;

function setup() {
  createCanvas(800, 480).parent('p5Canvas');
  raccoon = loadImage('./tanuki.png');
}

function draw() {
  background(255, 255, 255);

  if (raccoonjump) {
    raccoondy += raccoonv;
    raccoonv -= 0.4;
    if (raccoonv <= -racconV) raccoonjump = false;
  } else {
    raccoondy = 0;
  }
  beginShape();
  for (var i = -100; i < 900; i += 10) {
    vertex(i, raccoonY + 120 + sin(radians(i + score * (3 + sqrt(score) / 1000.0))) * 10);
  }
  vertex();
  endShape();
  image(raccoon, raccoonX, raccoonY - raccoondy, SIZE, SIZE);
  // text(raccondy, 100, 100);

  if (step == GAME) {
    score++;
  }
  hiscore = max(score, hiscore);
  $('#score').text(score);
  $('#hiscore').text(hiscore);
}

function mousePressed() {
  if (step == TITLE) {
    step = GAME;
  } else {
    if (!raccoonjump) {
      raccoonjump = true;
      raccoonv = racconV;
    }
  }
}
