class Fish {
    constructor({x, y, dir, colour}) {
        this.colour = colour;
        this.x = x;
        this.y = y;
        this.dir = dir;
    }

    drawFish() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI*2);
            ctx.fillStyle = fishColour;
            ctx.fill();
            ctx.closePath();
        }

    
    fishAct() {
        drawFish();
        moveFish();
        checkObstacle();
        this.findMouse();

    }

    moveFish() {
        if (Math.random < 0.3) {
            dx = -dx;
        }

        if (Math.random < 0.3) {
            dy = -dy;
        }

        x += dx;
        y += dy;
    }

     checkObstacle() {
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        }
    
        if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
            dy = -dy;
        }
    }

    /*find mouse*/
    findMouse() {
        if(mx != 0 && my != 0) {
            if (mx - (x + dx) > mx - (x - dx)) {
                dx = -dx;
            }

            if (my - (y + dy) < my - (y - dy)) {
                dy = -dy;

            }
        }

    };
}