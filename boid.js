const SIZE = 20;
const MIN_SPEED = 0;
const MAX_SPEED = 50;

const MAX_ACCELERATE = 0.1;

const DIST_REPULSE = SIZE*1.5;
const DIST_ALIGN = DIST_REPULSE*2;
const DIST_GROUP = DIST_ALIGN*2;

const WEIGHT_ALIGN = 1.0;
const WEIGHT_REPULSE = 10.0;
const WEIGHT_GROUP = 1.0;

class Boid{
    constructor(x,y){
        var angle = random(TAU);
        var totalSpeed = random(MIN_SPEED,MAX_SPEED);

        this.color = color(random(256),random(256),random(256));

        //IndexSizeError : Image drawn out of canvas
        while(x-SIZE/2 <= 0){
            x += SIZE/2;
        }
        while(x+SIZE/2 >= width){
            x -= SIZE/2;
        }
        while(y-SIZE/2 <= 0){
            y += SIZE/2;
        }
        while(y+SIZE/2 >= height){
            y -= SIZE/2;
        }

        this.width = SIZE;
        this.height = SIZE;
        this.position = createVector(x, y);     
        this.lastMoveTime = Date.now();   
        this.speed = createVector(cos(angle) * totalSpeed, sin(angle) * totalSpeed, 0);
    }
    /**
     * Draw the given image to current location
     * @param {Image} img 
     */
    draw(img,drawDist = false){
        imageMode(CENTER);
        push();
        var theta = atan2(this.speed.y,this.speed.x) ;
        translate(this.position.x, this.position.y);
        rotate(theta);
        fill(this.color);
        beginShape();
        vertex(0, this.height/2);
        vertex(0, -this.height/2);
        vertex(this.width, 0);
        endShape(CLOSE);

        rotate(radians(90));
        image(img, 0,0, this.width, this.height);

        if(drawDist){
            this.color.setAlpha(60);
            noFill();
            stroke(this.color);
            ellipseMode(CENTER);
            ellipse(0,0,DIST_REPULSE);
            ellipse(0,0,DIST_ALIGN);
            ellipse(0,0,DIST_GROUP);

            this.color.setAlpha(255);
        }
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

        if(accelerate.mag() == 0){
            accelerate = this.speed;
        }
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
            this.position.x -= width + this.width/2;
        }else if(this.position.x < -this.width/2){
            this.position.x += width+ this.width/2;
        }
        if(this.position.y >= height+ this.height/2){
            this.position.y -= height + this.height/2;
        }else if(this.position.y < -this.height/2){
            this.position.y += height+ this.height/2;
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
            if(dist < DIST_ALIGN && dist > 0){
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
        var thisToPoint = createVector(0,0);

        otherBoids.forEach(b => {
            var dist = b.distanceFrom(this);
            if(dist <= DIST_GROUP && dist > 0){
                pointToGo.add(b.position);
                cpt++;
            }
        });

        
        if(cpt > 0){
            pointToGo.div(cpt);
            thisToPoint = p5.Vector.sub(pointToGo,this.position);
        }
        return this.steeringVector(thisToPoint,1);
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

            if(dist < DIST_REPULSE && dist > 0){
                var diffVector = p5.Vector.sub(this.position,b.position);
                diffVector.normalize();

                //Less Distance More Power
                diffVector.div(dist)

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
            pointToGo.limit(MAX_ACCELERATE);
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