
var canvas = document.getElementById("myCanvas");

/*rendering context. Tool used to pain on Canvas*/
var ctx = canvas.getContext("2d");

/*fish vars*/
var numFish = 3;
var fishColour = "#8F8FFF";
var fishes = [];
var detectionRadius = 200;

/*mouse position variables*/
var mx = 0;
var my = 0;

/*vars for collision detection*/
var ballRadius = 10;

/** functions + classes**/
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

class Fish {
    constructor(x, y, colour, rad) {
        this.colour = colour;
        this.x = x;
        this.y = y;
        this.ballRadius = rad;

        this.dx = -1;
        this.dy = 1;
        this.offsetm = 1;
    }

    drawFish(rad, offsetx, offsety) {

        if (rad <= 5) {
            this.offsetm = 1;
            rad = ballRadius;
            return;
        }
        else {
            ctx.beginPath();

            console.log("x, y: " + offsetx + "," + offsety);

            ctx.arc(offsetx, offsety, rad, 0, Math.PI*2);
            ctx.fillStyle = this.colour;
            ctx.fill();
            ctx.closePath();

            rad -=1;
            this.offsetm += 1;

            this.drawFish(rad, offsetx - (this.dx * this.offsetm), 
            offsety - (this.dy * this.offsetm));
        }
    }

    fishAct() {
        ctx.globalAlpha = 0.5;
        this.drawFish(this.ballRadius, this.x, this.y);
        this.moveFish();
        this.findMouse();
        this.checkObstacle();
    }

    moveFish() {
        /*randomize turns*/
        if ((Math.random() < 0.005) || 
        (this.x + this.dx > canvas.width-ballRadius || this.x + this.dx < ballRadius)) {
            this.dx *= -1;
        }

        if ((Math.random() < 0.005) || 
        (this.y + this.dy > canvas.height-ballRadius || this.y + this.dy < ballRadius)) {
            this.dy *= -1;
        }

        // if (Math.random() < 0.005) {
        //     stopStartFish();
        // }

        /*less than 90 deg turns*/
        if (Math.random() < 0.005) {
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

        this.x += this.dx;
        this.y += this.dy;
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
        if ((this.x + this.dx < 0) || (this.x + this.dx > canvas.width)){
            this.dx *= -1;
        }

        if ((this.y + this.dy < 0) || (this.y + this.dy > canvas.height)) {
            this.dy *= -1;

        }
    }

    findMouse() {
        if(mx != 0 && my != 0) {
            var distx = mx - this.x;
            var disty = my - this.y;

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

    setSize();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < fishes.length; i++) {

        fishes[i].fishAct();
    }  
    requestAnimationFrame(draw);
};

addFish();
draw();
