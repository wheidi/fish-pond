//import {Fish} from "./fish.js";

var canvas = document.getElementById("myCanvas");

/*rendering context. Tool used to pain on Canvas*/
var ctx = canvas.getContext("2d");
const fps = 30;


/*fish vars*/
var numFish = 5;
var randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
var fishColour = "#8F8FFF";
var fishes = [];
var detectionRadius = 200;
var spaceMax = 5;

var ballRadius = 10;
var fishLength = 18;
var headLength = fishLength/8;
var torsoLength = (fishLength * 2)/8;
var tailLength = (fishLength * 5)/8;
var finWidth = 2;

/*mouse position variables*/
var mx = 0;
var my = 0;


/** functions + classes**/

/** PLAY/PAUSE POND **/
var play = true;

function pausePlayAnim() {
    play = !play;

    if (play) {

        console.log("playing")
        requestAnimationFrame(draw);
        document.querySelector('#playPause').innerText= 'Pause';
    } else {
        document.querySelector('#playPause').innerText= 'Play';
    }
}

/** POND **/
function setSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function setMouseCoords(event) {
    mx = event.clientX;
    my = event.clientY;

    let rect = canvas.getBoundingClientRect();
    mx -= rect.left;
    my -= rect.top;

    //console.log("x coords: " + mx + "Y coords: " + my);
}

function clearMouseCoords() {
    mx = 0;
    my = 0;
}

/**FISH PIECES */
class fishPiece {
    constructor (x, y, dx, dy, rad, colour) {
        this.colour = colour;
        this.x = x + dx + spaceMax;
        this.y = y + dy + spaceMax;
        this.prevx = x;
        this.prevy = y;
        this.ballRadius = rad;
    }
}

/**FISH */
class Fish {
    constructor(x, y, colour, rad) {
        this.colour = colour;
        this.headx = x;
        this.heady = y;
        this.ballRadius = rad;

        this.dx = -1;
        this.dy = -1;
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
        ctx.globalAlpha = 0.5;
        
        for (let i = 1; i < this.fishPieces.length; i++ ) {
            // console.log("curr fish coords: " + i + ": " + this.fishPieces[i].x + ", " + this.fishPieces[i].y);
            // console.log("prev fish coords: " + i + ": " + this.fishPieces[i-1].x + ", " + this.fishPieces[i-1].y);

            this.fishPieces[i].prevx = this.fishPieces[i].x;
            this.fishPieces[i].prevy = this.fishPieces[i].y;

            this.fishPieces[i].x = this.fishPieces[i - 1].prevx;
            this.fishPieces[i].y = this.fishPieces[i - 1].prevy;

            ctx.beginPath();
            ctx.arc(this.fishPieces[i].x, this.fishPieces[i].y, this.fishPieces[i].ballRadius, 0, Math.PI*2);
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

        if (this.speed < spaceMax && this.speed > 2) {
            if (chance < 0.05) {
                this.speed += 1;

            } else if (chance < 0.08 && chance > 0.04) {
                this.speed -= 1;
            }
        } else if (this.speed <= 2) {
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
                if (this.speed < spaceMax) {
                    this.speed += 1;
                }
            }

        }
    };
}

function addFish() {
    for (let i = 0; i < numFish; i++) {
        var x = Math.floor(Math.random() * ((canvas.width - ballRadius) + 1));
        var y = Math.floor(Math.random() * ((canvas.height - ballRadius) + 1));
        console.log("canvas w, h: " + canvas.width + ", "+canvas.height);
        var newFish = new Fish(x, y, fishColour, ballRadius);

        fishes.push(newFish);
    };
}

function draw() {
    if (!play) {
        console.log("paused");
        return;
    }

    setSize();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < fishes.length; i++) {

        fishes[i].fishAct();
    }  

    setTimeout(() => {
        requestAnimationFrame(draw);
      }, 1000 / fps);
};
setSize();
addFish();
draw();

