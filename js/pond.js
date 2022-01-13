
var canvas = document.getElementById("myCanvas");

/*rendering context. Tool used to pain on Canvas*/
var ctx = canvas.getContext("2d");
const fps = 35;


/*fish vars*/
var numFish = 3;
var fishColour = "#8F8FFF";
var fishes = [];
var detectionRadius = 200;
var spacing = 8;
var chubbiness = 2;

var ballRadius = 15;
var fishLength = 8;

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

class fishPiece {
    constructor (x, y, dx, dy, rad, colour) {
        this.colour = colour;
        this.x = x + dx + spacing;
        this.y = y + dy + spacing;
        this.prevx = x;
        this.prevy = y;
        this.ballRadius = rad;
    }
}

class Fish {
    constructor(x, y, colour, rad) {
        this.colour = colour;
        this.headx = x;
        this.heady = y;
        this.ballRadius = rad;
        this.dx = -1;
        this.dy = 1;
        this.fishPieces = [];

        this.assembleFish(this.ballRadius);
    }

    assembleFish(rad) {
        for (let i = 0; i < fishLength; i++) {
            if (rad > 0) {
                var newPiece = 
                new fishPiece (this.headx + this.dx + (spacing * (i + 1)), 
                this.heady + this.dy + (spacing * (i + 1)), this.dx, this.dy, rad, fishColour);

                this.fishPieces.push(newPiece);
                rad -= chubbiness;
            }
        }
    }

    drawFish() {
        ctx.globalAlpha = 0.5;

        for (let i = 1; i < this.fishPieces.length; i++ ) {
                        

                this.fishPieces[i].prevx = this.fishPieces[i].x;
                this.fishPieces[i].prevy = this.fishPieces[i].y;

                this.fishPieces[i].x = this.fishPieces[i - 1].prevx;
                this.fishPieces[i].y = this.fishPieces[i - 1].prevy;
            
            // console.log("curr fish coords: " + i + ": " + this.fishPieces[i].x + ", " + this.fishPieces[i].y);
            // console.log("prev fish coords: " + i + ": " + this.fishPieces[i-1].x + ", " + this.fishPieces[i-1].y);

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
        // if ((Math.random() < 0.0005) || 
        // (this.x + this.dx > canvas.width-ballRadius || this.x + this.dx < ballRadius)) {
        //     this.dx *= -1;
        // }

        // if ((Math.random() < 0.005) || 
        // (this.y + this.dy > canvas.height-ballRadius || this.y + this.dy < ballRadius)) {
        //     this.dy *= -1;
        // }

        // if (Math.random() < 0.005) {
        //     stopStartFish();
        // }

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

        //console.log("head coords: " + this.fishPieces[0])
        this.fishPieces[0].prevx = this.fishPieces[0].x;
        this.fishPieces[0].prevy = this.fishPieces[0].y;

        this.fishPieces[0].x += this.dx * spacing;
        this.fishPieces[0].y += this.dy * spacing;
    }

    // stopStartFish() {
    //     if (this.dx > 0.25 || this.dy > 0.25) {
    //         this.dx -= 0.25;
    //         this.dy -= 0.25;
    //     } else {
    //         this.dx += 1;
    //         this.dy += 1;
    //     }
    // }

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


function addFish() {
    for (let i = 0; i < numFish; i++) {
        var x = Math.floor(Math.random() * ((canvas.width - ballRadius) + 1));
        var y = Math.floor(Math.random() * ((canvas.height - ballRadius) + 1));

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

addFish();
draw();
