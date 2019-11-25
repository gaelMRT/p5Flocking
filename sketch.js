var img;
var boids = [];

const NB_BOIDS = 10;

function preload(){  
  img = createImg("assets/CFPTI.png","");
  img.hide();
  
}

function setup() {
  createCanvas(400, 400);

  // put setup code here
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
    b.draw(img);
  });
}