var hiscore = 0;
var score = 0;
var life = 3;
var raccoon1;
var raccoon2;
var rabbit1;
var rabbit2;
var ship;

var prabbitx = 0;
var rabbitx = 0;
var rabbitdx = 0;
var rabbitY = 380;
var move_frame = 0;

var result_score;
var result_frame = 0;

var WATER_Y = 425;
var FIELD_X = 80;
var FIELD_Y = 400;

function Raccoon(x, y) {
  this.y = y;
  this.x = x;
  this.dx = 0;
  this.dy = 0;
  this.ddy = 0.1;
  this.ship_x = x;
  this.water_frame = 0;
  this.think_frame = random(100, 200);
  this.with_ship = true;
  this.scored = false;

  this.update = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.dy += this.ddy;
    if (this.y > WATER_Y - 60 && this.with_ship) {
      this.dy *= 0.9;
      this.water_frame++;
      this.dy -= sq(map(this.y, WATER_Y - 60, height, 0, 1));
      if (this.water_frame++ > this.think_frame)
        this.dy += sq(map(this.water_frame, this.think_frame, this.think_frame + 100, 0, 0.2));
      if (this.with_ship && this.y > WATER_Y) {
        this.with_ship = false;
        this.dx = random(-1, 0);
        this.dy = -random(6, 9);
      }
    }
    if (this.x < FIELD_X && this.y > FIELD_Y - 40) {
      this.dx = -1;
      this.dy = 0;
      this.y = (this.y + FIELD_Y - 40) / 2;
      if (!this.scored) {
        this.scored = true;
        score++;
      }
    }
  };

  this.draw = function() {
    if (this.x < FIELD_X) {
      image(raccoon1, this.x, this.y, 80, 80);
    } else {
      if (this.dy < -1 || this.y > WATER_Y)
        image(raccoon1, this.x, this.y, 80, 80);
      else
        image(raccoon2, this.x, this.y, 80, 80);
      if (this.with_ship)
        image(ship, this.x, this.y, 120, 120);
    }
  };
}

raccoons = [];

var TITLE = 0;
var GAME = 1;
var RESULT = 2;

var step = TITLE;

function setup() {
  createCanvas(800, 450).parent('p5Canvas');
  raccoon1 = loadImage('./img/tanuki.png');
  raccoon2 = loadImage('./img/tanuki2.png');
  rabbit1 = loadImage('./img/usagi1.png');
  rabbit2 = loadImage('./img/usagi2.png');
  ship = loadImage('./img/dorobune.png');
  textAlign(CENTER);
  textSize(30);
  imageMode(CENTER);
  raccoons.push(new Raccoon(width / 2, 0));

  // hiscore = int(document.cookie);
  // $(window).on("beforeunload", function(e) {
  //   document.cookie = hiscore;
  // });
}

var f = 600;


function draw() {
  background(255, 255, 255);

  if (step == GAME) {

    if (--f <= 0 || raccoons.length === 0) {
      f = map(min(score, 30), 0, 30, 600, 60);
      raccoons.push(new Raccoon(random(150, width - 100), 0));
    }
    $.each(raccoons, function(i, v) {
      v.update();
      if (v.with_ship) {
        if (sq(v.x - rabbitx) + sq(v.y - rabbitY) < 80 * 80) {
          if (v.dy > 3) {
            if (v.x < rabbitx)
              rabbitdx = 10;
            else
              rabbitdx = -10;
          }
        }
      } else if (v.dy > 0) {
        if (sq(v.x - rabbitx) + sq(v.y - rabbitY) < 70 * 70) {
          var a = atan2(v.y - rabbitY, v.x - rabbitx);
          var s = random(4, 7);
          v.dx = cos(a) * s;
          v.dy = sin(a) * s;
        }
      }
    });
    del_raccoon = raccoons.filter(function(v) {
      return v.y > height;
    });
    if (del_raccoon.length > 0) {
      life -= del_raccoon.length;
      if (life <= 0) {
        step = TITLE;
        result_frame = 60;
        result_score = score;
      }
      raccoons = raccoons.filter(function(v) {
        if (v.y <= height) return true;
        if (v.scored && v.x < -50) return true;
        return false;
      });
    }
  }

  rabbitx += rabbitdx;
  rabbitdx *= 0.9;
  rabbitx = (mouseX + rabbitx * 9) / 10;
  rabbitx = constrain(rabbitx, FIELD_X + 50, width - 50);


  if (step == GAME) {
    $.each(raccoons, function(i, v) {
      v.draw();
    });
  }

  if (abs(prabbitx - rabbitx) > 3)
    image(rabbit1, rabbitx, rabbitY, 100, 100);
  else
    image(rabbit2, rabbitx, rabbitY, 100, 100);

  if (step == GAME) {
    for (var i = 0; i < life; i++) {
      fill(0);
      text('Life', width - 150, 40);
      image(raccoon1, width - 30 - i * 30, 30, 30, 30);
    }
  } else {
    if (result_frame > 0) {
      if (result_frame != 30)
        result_frame--;
      var dd = map(result_frame, 60, 0, sqrt(width), -sqrt(width));
      dd = dd * dd;
      textSize(50);
      fill(0);
      text('RESULT', width / 2 + dd, height / 5);
      text(result_score, width / 2 + dd, height * 3 / 5);
      var a = TWO_PI / result_score;
      for (ii = 0; ii < result_score; ii++) {
        image(raccoon1, width / 2 + dd + cos(a * ii) * 200, height * 3 / 5 - 10 + sin(a * ii) * 100, 40, 40);
      }
    } else {
      textSize(30);
      fill(0);
      text('Click to start', width / 2, height / 2);
    }
  }

  fill(150, 20, 200);
  rect(0, WATER_Y, width, 100);
  fill(100, 200, 100);
  rect(0, FIELD_Y, FIELD_X, 100);


  hiscore = int(max(score, hiscore));
  $('#score').text(int(score));
  $('#hiscore').text(hiscore);

  prabbitx = rabbitx;
}

function mousePressed() {
  if (result_frame === 30) {
    result_frame--;
  } else if (step == TITLE) step = GAME;
}
