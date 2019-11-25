const SIZE = 20;
const MIN_SPEED = 10;
const MAX_SPEED = 70;

const MAX_ACCELERATE = 0.05;

const DIST_REPULSE = SIZE*2;
const DIST_ALIGN = DIST_REPULSE*2;
const DIST_GROUP = DIST_ALIGN*2;

const WEIGHT_ALIGN = 2.0;
const WEIGHT_REPULSE = 100.0;
const WEIGHT_GROUP = 2.0;

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
        translate(this.position.x, this.position.y);
        //draw zones
        if(drawDist){
            push();
            this.color.setAlpha(60);
            noFill();
            stroke(this.color);
            ellipseMode(CENTER);

            //Show zones
            ellipse(0,0,DIST_REPULSE);
            ellipse(0,0,DIST_ALIGN);
            ellipse(0,0,DIST_GROUP);
            //Show borderfluid zone DIST_GROUP
            var isXLessGROUP = this.position.x - DIST_GROUP < 0;
            var isXMoreGROUP = this.position.x + DIST_GROUP > width;
            var isYLessGROUP = this.position.y - DIST_GROUP < 0;
            var isYMoreGROUP = this.position.y + DIST_GROUP > this.width;
            if(isXLessGROUP){
                ellipse(width,0,DIST_GROUP);
            }
            if(isXMoreGROUP){
                ellipse(-width,0,DIST_GROUP);
            }
            if(isYLessGROUP){
                ellipse(0,height,DIST_GROUP);
            }
            if(isYMoreGROUP){
                ellipse(0,-height,DIST_GROUP);
            }
            if(isXLessGROUP && isYLessGROUP){
                ellipse(width,height,DIST_GROUP);
            }
            if(isXMoreGROUP && isYLessGROUP){
                ellipse(-width,height,DIST_GROUP);
            }
            if(isXLessGROUP && isYMoreGROUP){
                ellipse(width,-height,DIST_GROUP);
            }
            if(isXMoreGROUP && isYMoreGROUP){
                ellipse(-width,-height,DIST_GROUP);
            }

            //Show borderfluid zone DIST_ALIGN
            var isXLessALIGN = this.position.x - DIST_ALIGN < 0;
            var isXMoreALIGN = this.position.x + DIST_ALIGN > width;
            var isYLessALIGN = this.position.y - DIST_ALIGN < 0;
            var isYMoreALIGN = this.position.y + DIST_ALIGN > this.width;
            if(isXLessALIGN){
                ellipse(width,0,DIST_ALIGN);
            }
            if(isXMoreALIGN){
                ellipse(-width,0,DIST_ALIGN);
            }
            if(isYLessALIGN){
                ellipse(0,height,DIST_ALIGN);
            }
            if(isYMoreALIGN){
                ellipse(0,-height,DIST_ALIGN);
            }
            if(isXLessALIGN && isYLessALIGN){
                ellipse(width,height,DIST_ALIGN);
            }
            if(isXMoreALIGN && isYLessALIGN){
                ellipse(-width,height,DIST_ALIGN);
            }
            if(isXLessALIGN && isYMoreALIGN){
                ellipse(width,-height,DIST_ALIGN);
            }
            if(isXMoreALIGN && isYMoreALIGN){
                ellipse(-width,-height,DIST_ALIGN);
            }

            //Show borderfluid zone DIST_REPULSE
            var isXLessREPULSE = this.position.x - DIST_REPULSE < 0;
            var isXMoreREPULSE = this.position.x + DIST_REPULSE > width;
            var isYLessREPULSE = this.position.y - DIST_REPULSE < 0;
            var isYMoreREPULSE = this.position.y + DIST_REPULSE > this.width;
            if(isXLessREPULSE){
                ellipse(width,0,DIST_REPULSE);
            }
            if(isXMoreREPULSE){
                ellipse(-width,0,DIST_REPULSE);
            }
            if(isYLessREPULSE){
                ellipse(0,height,DIST_REPULSE);
            }
            if(isYMoreREPULSE){
                ellipse(0,-height,DIST_REPULSE);
            }
            if(isXLessREPULSE && isYLessREPULSE){
                ellipse(width,height,DIST_REPULSE);
            }
            if(isXMoreREPULSE && isYLessREPULSE){
                ellipse(-width,height,DIST_REPULSE);
            }
            if(isXLessREPULSE && isYMoreREPULSE){
                ellipse(width,-height,DIST_REPULSE);
            }
            if(isXMoreREPULSE && isYMoreREPULSE){
                ellipse(-width,-height,DIST_REPULSE);
            }

            pop();
            this.color.setAlpha(255);

        }// end if(drawDist)


        var theta = atan2(this.speed.y,this.speed.x) ;
        rotate(theta);
        fill(this.color);
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
        
        //Recalculate after border passage
        if(this.position.x > width + this.width/2){
            this.position.x -= width ;
        }else if(this.position.x < -this.width/2){
            this.position.x += width;
        }
        if(this.position.y >= height+ this.height/2){
            this.position.y -= height ;
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
            if(dist.mag() < DIST_ALIGN && dist.mag() > 0){
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
            if(dist.mag() <= DIST_GROUP && dist.mag() > 0){
                
                pointToGo.add(this.shortestEmplacement(dist));
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

            if(dist.mag() < DIST_REPULSE && dist.mag() > 0){
                var diffVector = p5.Vector.sub(this.position,this.shortestEmplacement(dist));
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
     * Calculate distance from current to other boid including borderfluid
     * @param {Boid} boid 
     */
    distanceFrom(boid){
        var distX = boid.position.x - this.position.x;
        var distY = boid.position.y - this.position.y;

        if(distX > width/2){
            distX -= width;
        }
        if(distX < -width/2){
            distX += width;
        }

        if(distY > height/2){
            distY -= height;
        }
        if(distY < -height/2){
            distY += height;
        }

        var vectorDist = createVector(distX, distY);
        return vectorDist;
    }
    /**
     * Get the distance vector and transform it to a global position vector
     * @param {p5.Vector} distVector 
     */
    shortestEmplacement(distVector){
        return createVector(this.position.x - distVector.x,this.position.y - distVector.y);
    }
}