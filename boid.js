const SIZE = 30;
const MIN_SPEED = 30;
const MAX_SPEED = 50;

const ROTATE_STEP = 0.02;

const DIST_ALIGN = 150;
const DIST_REPULSE = 70;
const DIST_GROUP = 200;

const WEIGHT_ALIGN = 3.0;
const WEIGHT_REPULSE = 5.0;
const WEIGHT_GROUP = 2.0;

class Boid{
    constructor(x,y){
        var angle = random(TAU);
        var totalSpeed = random(MIN_SPEED,MAX_SPEED);

        this.color = color(random(256),random(256),random(256));

        this.width = SIZE;
        this.height = SIZE;
        this.position = createVector(x, y);     
        this.lastMoveTime = Date.now();   
        this.speed = createVector(cos(angle)*totalSpeed,sin(angle)*totalSpeed,0);
    }
    /**
     * Draw the given image to current location
     * @param {Image} img 
     */
    draw(img){
        imageMode(CENTER);
        push();
        var theta = atan2(this.speed.y,this.speed.x) ;
        translate(this.position.x, this.position.y);
        rotate(theta);
        
        beginShape();
        vertex(0, this.height/2);
        vertex(0, -this.height/2);
        vertex(this.width, 0);
        endShape(CLOSE);

        rotate(radians(90));
        image(img, 0,0, this.width, this.height);
        pop();
    }
    /**
     * Recalculate the speed for current boid
     * @param {array[Boid]} boids 
     */
    recalculateSpeed(boids){
        var al = this.align(boids).normalize();
        var re = this.repulse(boids);
        var gr = this.group(boids);
        
        al.mult(WEIGHT_ALIGN);
        re.mult(WEIGHT_REPULSE);
        gr.mult(WEIGHT_GROUP);
        
        var accelerate = createVector(0,0);
        accelerate.add(al);
        accelerate.add(re);
        accelerate.add(gr);

        accelerate.mult(ROTATE_STEP);

        this.speed.add(accelerate);
        if(this.speed.mag() < MIN_SPEED){
            this.speed.normalize();
            this.speed.mult(MIN_SPEED)    
        }
        this.speed.limit(MAX_SPEED);

    }
    /**
     * Apply the speed until the last time
     */
    move(){
        var elapsedSec = (Date.now() - this.lastMoveTime)/1000.0;
        this.lastMoveTime = Date.now();
        this.position.x += this.speed.x*elapsedSec;
        this.position.y += this.speed.y*elapsedSec;
        
        if(this.position.x > width + this.width/2){
            this.position.x -= width;
        }else if(this.position.x < -this.width/2){
            this.position.x += width;
        }
        if(this.position.y >= height+ this.height/2){
            this.position.y -= height;
        }else if(this.position.y < -this.height/2){
            this.position.y += height;
        }
    }
    /**
     * Give a vector where to align itself
     * @param {Array[Boid]} otherBoids 
     */
    align(otherBoids){
        var pointToGo = createVector(0,0);
        var cpt = 0;
        
        otherBoids.forEach(b => {
            var dist = b.distanceFrom(this);
            if(dist <= DIST_ALIGN && dist > 0){
                pointToGo.add(b.speed);
                cpt++;
            }
        }); 
        return this.steeringVector(pointToGo,cpt);
    }

    /**
     * Give a vector where to group with other
     * @param {Array[Boid]} otherBoids 
     */
    group(otherBoids){
        var pointToGo = createVector(0,0);
        var cpt = 0;
        otherBoids.forEach(b => {
            var dist = b.distanceFrom(this);
            if(dist <= DIST_GROUP && dist > 0){
                pointToGo.add(b.position);
                cpt++;
            }
        });
        var vectorToPoint = createVector(0,0);
        if(cpt > 0){
            pointToGo.div(cpt);
            vectorToPoint = p5.Vector.sub(pointToGo,this.position);
        }
        return this.steeringVector(vectorToPoint,1);
    }
    /**
     * Give a vector where to repulse from other
     * @param {Array[Boid]} otherBoids 
     */
    repulse(otherBoids){
        var pointToGo = createVector(0,0);
        var cpt = 0;
        otherBoids.forEach(b => {
            var dist = b.distanceFrom(this);

            if(dist <= DIST_REPULSE && dist != 0){
                var diffVector = p5.Vector.sub(this.position,b.position);
                diffVector.normalize();
                pointToGo.add(diffVector);
                cpt++;
            }
        });

        return this.steeringVector(pointToGo,cpt);
    }
    /**
     * Make the normalizing to steer to pointToGo where cpt is the number to divide by
     * @param {Vector} pointToGo 
     * @param {int} cpt 
     */
    steeringVector(pointToGo,cpt){
        if(cpt > 0){
            pointToGo.div(cpt);
            pointToGo.normalize();
            pointToGo.mult(MAX_SPEED);
            pointToGo.sub(this.speed);
            pointToGo.limit(MAX_SPEED);
        }
        return pointToGo;

    }
    /**
     * Calculate distance from current to other boid
     * @param {Boid} boid 
     */
    distanceFrom(boid){
        var distX = boid.position.x - this.position.x;
        var distY = boid.position.y - this.position.y;
        var dist = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
        return dist;
    }
}