var score = 0;
var hiscore = 99.99;
var combo = 0;

var start_time;
var ms = moment(0);
var hims = moment(1800000);

var mx = 0;
var my = 0;

var shoot_time = 0;
var shoot_frame = 20;

var add_frame = 0;

function Balloon(x, y, apple, diff) {
  this.x = x;
  this.y = y;
  this.dy = -1 * diff;
  this.dx = 0;
  this.ddy = 0;
  this.r = 50;

  if (apple) {
    this.r = 20;
    this.dy = -3 * sqrt(diff);
    this.ddy = 0.1;
    this.dx = random(-1, 1);
  }

  this.draw = function() {
    fill(255, 100, 100);
    stroke(255, 200, 200);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  };

  this.update = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.dy += this.ddy;
  };

  this.add_apple = function() {
    if (!apple) {
      balloons.push(new Balloon(this.x, this.y, true, diff, false));
      score += 100;
    } else {
      score += 500;
    }
  };
}

var balloons = [];

var TITLE = 0;
var GAME = 1;
var RESULT = 1;
var step = TITLE;

function setup() {
  createCanvas(800, 450).parent('p5Canvas');

  mx = width / 2;
  my = height / 2;
}

function draw() {
  background(255);
  if (mouseX !== 0 || mouseY !== 0) {
    mx = constrain((mouseX + mx * 4) / 5, 0, width);
    my = constrain((mouseY + my * 4) / 5, 0, height);
  }
  if (shoot_time > 0) {
    shoot_time--;
  }
  if (step == GAME) {
    $.each(balloons, function(i, v) {
      v.update();
    });
    $.each(balloons, function(i, v) {
      v.draw();
    });
  } else if (step == TITLE) {
    textSize(20);
    textAlign(CENTER);
    noStroke();
    fill(100, 100, 200);
    ellipse(width / 2, height / 2, 100, 100);
    stroke(0);
    fill(255);
    text("START!!", width / 2, height / 2 + 10);
  }
  var p = sq(shoot_time / shoot_frame);
  var r = 20 * (1 - p);
  var c = HALF_PI * p;
  stroke(0);
  line(mx + r * cos(c), my + r * sin(c), mx + r * cos(c + PI), my + r * sin(c + PI));
  c += HALF_PI;
  line(mx + r * cos(c), my + r * sin(c), mx + r * cos(c + PI), my + r * sin(c + PI));
  if (step == GAME && combo > 0) {
    textSize(30);
    textAlign(CENTER);
    fill(0);
    text(combo + ' CHAIN', width / 2, 60);
  }

  if (--add_frame <= 0) {
    add_frame = map(combo, 0, 50, 100, 10);
    balloons.push(new Balloon(random(100, width - 100), height + 100, false, map(score, 0, 10000, 1, 3)));
  }
  balloons = balloons.filter(function(v) {
    if (v.x > -200 && v.y > -200 && v.x < width + 200 && v.y < height + 200)
      return true;
    return false;
  });

  if (step == GAME) {
    ms = moment(moment() - start_time);
  }

  $('#score').text(score + ' / 10000');
  $('#time').text(ms.format('mm:ss.SS'));
  $('#hitime').text(hims.format('mm:ss.SS'));
}

function shoot() {
  var del_bal = balloons.filter(function(v) {
    return (mx - v.x) * (mx - v.x) + (my - v.y) * (my - v.y) < v.r * v.r;
  });
  balloons = balloons.filter(function(v) {
    if ((mx - v.x) * (mx - v.x) + (my - v.y) * (my - v.y) >= v.r * v.r)
      return true;
    return false;
  });
  $.each(del_bal, function(i, v) {
    v.add_apple();
  });
  if (del_bal.length === 0) {
    combo = 0;
  } else {
    combo += sq(del_bal.length);
  }

  if (score >= 10000) {
    step = TITLE;
    hims = ms;
  }
}

function mousePressed() {
  if (shoot_time > 0) {
    return;
  }
  shoot_time = shoot_frame;

  if (step == TITLE) {
    if ((mx - width / 2) * (mx - width / 2) + (my - height / 2) * (my - height / 2) < 50 * 50) {
      step = GAME;
      start_time = moment();
      frameCount = 0;
      balloons = [];
    }
    return;
  }

  shoot();
}
