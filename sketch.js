var img;
var boids = [];

const NB_BOIDS = 50;

function preload(){
  //Get Image directly from github to avoid "CORS" errors
  img = loadImage("https://raw.githubusercontent.com/gaelMRT/p5Flocking/master/CFPTI.png");  
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  for (let i = 0; i < NB_BOIDS; i++) {
    boids.push(new Boid(random(width),random(height)));
  }
}

function draw() {
  background(64);
  boids.forEach(b => {
    b.recalculateSpeed(boids);
  });
  boids.forEach(b => {
    b.move(boids);
    //Second argument : isDrawingDistances
    b.draw(img,false);
  });
}