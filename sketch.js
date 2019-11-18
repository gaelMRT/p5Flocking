var img;
var boids;

const NB_BOIDS = 10;

function preload(){
  img = loadImage('https://edu.ge.ch/site/cfpt/wp-content/uploads/sites/112/2016/03/loginformatique_dir_couleur.png');
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
    b.move(width,height);
    b.draw(img);
  });
}