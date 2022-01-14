/**FISH */
class Fish {
    constructor(x, y, colour, rad) {
        this.colour = colour;
        this.headx = x;
        this.heady = y;
        this.ballRadius = rad;
        this.dx = 1;
        this.dy = 1;
        this.fishPieces = [];
        this.speed = spaceMax/2;

        this.assembleFish(this.ballRadius);
    }

    assembleFish(rad) {
        for (let i = 0; i < fishLength; i++) {
            if (rad > 0) {
                if (i < headLength) {

                    var newPiece = 
                    new fishPiece (this.headx + this.dx + (this.speed * (i + 1)), 
                    this.heady + this.dy + (this.speed * (i + 1)), this.dx, this.dy, rad - 1, fishColour);

                    this.fishPieces.push(newPiece);
                    rad += 1;

                } else if (i > fishLength - tailLength) {
                    var newPiece = 
                    new fishPiece (this.headx + this.dx + (this.speed * (i + 1)), 
                    this.heady + this.dy + (this.speed * (i + 1)), this.dx, this.dy, rad, fishColour);

                    this.fishPieces.push(newPiece);
                    rad -= 1;

                }  else if ((i => headLength) && (i < torsoLength)){
                    var newPiece = 
                    new fishPiece (this.headx + this.dx + (this.speed * (i + 1)), 
                    this.heady + this.dy + (this.speed * (i + 1)), this.dx, this.dy, rad, fishColour);

                    this.fishPieces.push(newPiece);
                }

                else {
                    var newPiece = 
                    new fishPiece (this.headx + this.dx + (this.speed * (i + 1)), 
                    this.heady + this.dy + (this.speed * (i + 1)), this.dx, this.dy, rad, fishColour);

                    this.fishPieces.push(newPiece);
                    rad -= 1;
                }
            }
        }

        var currfinW = 1;
        for (let i = 0; i < finWidth + 3; i++) {

            if (rad > 0) {

                var newPiece = 
                new fishPiece (this.headx + this.dx + (this.speed * (i + 1)), 
                this.heady + this.dy + (this.speed * (i + 1)), this.dx, this.dy, currfinW , fishColour);

                this.fishPieces.push(newPiece);

                if (i >= finWidth) {
                    currfinW -= 1;
                } else if (currfinW < finWidth) {
                    currfinW += 1;
                }
            
            }
        }
    }

    drawFish() {
        ctx.globalAlpha = 0.25;
        
        for (let i = 1; i < this.fishPieces.length; i++ ) {
            // console.log("curr fish coords: " + i + ": " + this.fishPieces[i].x + ", " + this.fishPieces[i].y);
            // console.log("prev fish coords: " + i + ": " + this.fishPieces[i-1].x + ", " + this.fishPieces[i-1].y);

                this.fishPieces[i].prevx = this.fishPieces[i].x;
                this.fishPieces[i].prevy = this.fishPieces[i].y;

                this.fishPieces[i].x = this.fishPieces[i - 1].prevx;
                this.fishPieces[i].y = this.fishPieces[i - 1].prevy;

                ctx.beginPath();

                if (this.speed < 3) {
                    ctx.arc(this.fishPieces[i].x, this.fishPieces[i].y, this.fishPieces[i].ballRadius, 0, Math.PI*2);
                } else {
                    ctx.arc(this.fishPieces[i].x, this.fishPieces[i].y, this.fishPieces[i].ballRadius, 0, Math.PI*2);
                };

                ctx.fillStyle = this.colour;
                ctx.fill();
                ctx.closePath();
 
        }
    }

    fishAct() {
        this.drawFish();
        this.moveFish();
        this.findMouse();
        this.checkObstacle();
    }

    moveFish() {
        /*complete changes in direction*/

        this.triggRandomTurn();
        this.triggSpeedChange();


        //set x, y for fish head
        this.fishPieces[0].prevx = this.fishPieces[0].x;
        this.fishPieces[0].prevy = this.fishPieces[0].y;

        this.fishPieces[0].x += this.dx * this.speed;
        this.fishPieces[0].y += this.dy * this.speed;
    }

    triggRandomTurn() {
        /*less than 90 deg turns*/

        if (Math.random() < 0.05) {

            var nx = Math.random();
            var ny = Math.random();

            var t = Math.sqrt((nx * nx) + (ny * ny));

            if (this.dx > 0) {
                this.dx = nx/t;
            } else {
                this.dx = -nx/t;
            }

            if (this.dy > 0) {
                this.dy = ny/t;
            } else {
                this.dy = -ny/t;
            }
        }
    }

    triggSpeedChange() {
        var chance = Math.random();

        if (this.speed < spaceMax && this.speed > 1) {
            if (chance < 0.04) {
                this.speed += 1;

            } else if (chance < 0.08 && chance > 0.03) {
                this.speed -= 1;
            }
        } else if (this.speed <= 1) {
            this.speed += 1;
        } else if (this.speed >= spaceMax) {
            this.speed -=1;
        }
    }

    checkObstacle() {
        if ((this.fishPieces[0].x + this.dx < 0) || (this.fishPieces[0].x + this.dx > canvas.width)){
            this.dx *= -1;
        }

        if ((this.fishPieces[0].y + this.dy < 0) || (this.fishPieces[0].y + this.dy > canvas.height)) {
            this.dy *= -1;

        }
    }

    findMouse() {
        if(mx != 0 && my != 0) {

            //console.log("mouse coords: " + mx +", "+my);

            var distx = mx - this.fishPieces[0].x;
            var disty = my - this.fishPieces[0].y;

            var h = Math.sqrt(distx * distx + disty * disty);

            if (h < detectionRadius){
                this.dx = distx/h;
                this.dy = disty/h;
            }

        }
    };
}

//export class {Fish};