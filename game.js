var hiscore = 0;
var score = 0;
var raccoon;
var raccoon2;

var raccoonX = 50;
var raccoonY = 300;
var raccoonV = 12;
var SIZE = 100;

var raccoondy = 0;
var raccoonv = 0;
var raccoonjump = false;

var fox;
var foxsx = [900, 1800];

var TITLE = 0;
var GAME = 1;

var step = TITLE;

function setup() {
  createCanvas(800, 480).parent('p5Canvas');
  fox = loadImage('./kitune.png');
  raccoon = loadImage('./tanuki.png');
  raccoon2 = loadImage('./tanuki2.png');
  textAlign(CENTER);
  textSize(50);

  foxsx.push(900);
}

function draw() {
  background(255, 255, 255);
  var scored = 0.5 + sqrt(sqrt(score)) / 100;
  var scored2 = 5 + sqrt(score) / 20;

  if (raccoonjump) {
    raccoondy += raccoonv;
    raccoonv -= 0.4;
    if (raccoonv <= -raccoonV) raccoonjump = false;
    scored += 0.1;
  } else {
    raccoondy = 0;
  }
  var D = 60 * 60;

  $.each(foxsx, function(i, foxx) {
    if (raccoondy * raccoondy + (raccoonX - foxx) * (raccoonX - foxx) < D) {
      step = TITLE;
    }
  });
  beginShape();
  for (var i = -100; i < 900; i += 10) {
    vertex(i, raccoonY + 120 + sin(radians(i + score * scored2)) * 10);
  }
  vertex();
  endShape();
  if (int((score / 10)) % 2 === 0 || raccoonjump) {
    image(raccoon, raccoonX, raccoonY - raccoondy, SIZE, SIZE);
  } else {
    image(raccoon2, raccoonX, raccoonY - raccoondy, SIZE, SIZE);
  }
  $.each(foxsx, function(i, foxx) {
    image(fox, foxx, raccoonY, SIZE, SIZE);
  });

  if (step == GAME) {
    score += scored;

    $.each(foxsx, function(i, foxx) {
      textSize(10);
      textAlign(LEFT);
      // text(int(foxsx[i]), 100 + i * 100, 100);
      foxsx[i] -= scored2 * scored;
      if (foxsx[i] < -200) {
        foxsx[i] = 1200 + random(-100, 100);
      }
    });
  } else {
    text("Click Start !!!!!", width / 2, height / 2);
  }
  hiscore = int(max(score, hiscore));
  $('#score').text(int(score));
  $('#hiscore').text(hiscore);
}

function press() {
  if (step == TITLE) {
    step = GAME;
    score = 0;
    foxsx = [900, 1800];
  } else {
    if (!raccoonjump) {
      raccoonjump = true;
      raccoonv = raccoonV;
    }
  }
}

function keyPressed() {
  if (keyCode == ENTER) {
    press();
  }
}

function mousePressed() {
  press();
}
