const SIZE = 10;
const MIN_SPEED = 5;
const MAX_SPEED = 10;

const DIST_ALIGN = 50;
const DIST_REPULSE = 25;
const DIST_GROUP = 100;

const WEIGHT_ALIGN = 1.0;
const WEIGHT_REPULSE = 1.0;
const WEIGHT_GROUP = 1.0;

class Boid{
    constructor(x,y){
        var angle = random(TAU);
        var totalSpeed = random(MIN_SPEED,MAX_SPEED);

        this.width = SIZE;
        this.height = SIZE;
        this.lastMoveTime = time();
        this.position = createVector(x, y);        
        this.speed = createVector(cos(angle)*totalSpeed,sin(angle)*totalSpeed,0);
    }
    draw(img){
        imageMode(CENTER);
        ellipseMode(CENTER);
        ellipse( this.position.x, this.position.y, this.width, this.height);
        //image(img, this.position.x, this.position.y, this.width, this.height);
    }
    move(maxWidth, maxHeight){
        var elapsed = time() - this.lastMoveTime;
        this.lastMoveTime = time();
        this.position.x += this.speed.x*elapsed;
        this.position.y += this.speed.y*elapsed;
        
        if(this.position.x + this.width/2 > maxWidth){
            this.position.x -= maxWidth;
        }else if(this.position.x < this.width/2){
            this.position.x += maxWidth;
        }
        if(this.position.y + this.height/2 > maxHeight){
            this.position.y -= maxHeight;
        }else if(this.position.y < this.height/2){
            this.position.y += maxHeight;
        }


    }
    align(otherBoids){

    }
    group(otherBoids){

    }
    repulse(otherBoids){

    }
}