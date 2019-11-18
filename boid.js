const SIZE = 10;
const MIN_SPEED = 5;
const MAX_SPEED = 10;

class Boid{
    constructor(x,y){
        var angle = random(TAU);
        var speed = random(MIN_SPEED,MAX_SPEED);

        this.width = SIZE;
        this.height = SIZE;
        this.position = createVector(x, y);        
        this.speed = createVector(cos(angle)*speed,sin(angle)*speed,0);
    }
    draw(img){
        imageMode(CENTER);
        image(img, this.position.x, this.position.y, this.width, this.height);
    }
}