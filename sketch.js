var img;
var boids;

const NB_BOIDS = 10;

function preload(){
  img = loadImage('./CFPTI.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // put setup code here
  for (let i = 0; i < NB_BOIDS; i++) {
    boids.push(new Boid(random(width),random(height)));
  }
}

function draw() {
  background(64);
  boids.forEach(b => {
    var al = b.align(boids);
    var re = b.repulse(boids);
    var gr = b.group(boids);
  });
  boids.forEach(b => {
    b.move(boids);
    b.draw(img);
  });
}