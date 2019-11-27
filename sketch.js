var img;
var boids = [];
var showDraw = false;
var canvasWidth = 500;
var canvasHeight = 500;

const NB_BOIDS = 20;


function preload(){
  //Get Image directly from github to avoid "CORS" errors
  img = loadImage("https://raw.githubusercontent.com/gaelMRT/p5Flocking/master/CFPTI.png");  
}

// Add a new boid into the System
function mousePressed() {
  boids.push(new Boid(mouseX, mouseY));
}
// Add a new boid into the System
function mouseDragged() {
  boids.push(new Boid(mouseX, mouseY));
}


function setup() {
  createCanvas(canvasWidth,canvasHeight);
  
  for (let i = 0; i < NB_BOIDS; i++) {
    boids.push(new Boid(random(width),random(height)));
  }
  
}
function keyPressed(){
  if(keyCode === 82){
    showDraw = !showDraw;
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
    b.draw(img,showDraw);
  });
}