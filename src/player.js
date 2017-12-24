// used to define player object
function Player(radius, speed, x, y, dx, dy) {
	this.radius = radius;
	this.speed = speed;
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.isAlive = true;
	this.onGround = false;
	this.control = new Controller();
}

function Controller() {
	this.left = 0;
	this.right = 0;
	this.jump = 0;
}

// used to define camera object
function Camera(width, height) {
	this.x = 0;
	this.y = 0;
	this.width = width;
	this.height = height;
	this.parallaxX = 2;
	this.parallaxY = 4;
	this.follow = function(target) {
		this.x = (target.x - canvas.width + this.width/2)/this.parallaxX;
		if(this.x < (target.x - 9 * canvas.width/10)) {
			this.x = (target.x - 9 * canvas.width/10);
		} else if(this.x > target.x - canvas.width/10) {
			this.x = target.x - canvas.width/10;
		}
		if(canvas.height > this.height) {
			this.y = (target.y - canvas.height/2)/this.parallaxY;
		} else {
			this.y = 0;
		}
	}
}

function drawPlayer(camera, player) {
	if(player.y - camera.y > 0) {
		ctx.beginPath();
	    ctx.arc(player.x - camera.x, player.y - camera.y, player.radius, 0, Math.PI*2);
	    ctx.fillStyle = "#000000";
	    ctx.fill();
	    ctx.closePath();
	} else {
		ctx.beginPath();
		ctx.moveTo(player.x - camera.x, 10);
		ctx.lineTo(player.x - camera.x - 5, 15);
		ctx.lineTo(player.x - camera.x + 5, 15);
		ctx.strokeStyle = "#000000";
		ctx.stroke();
		ctx.fillStyle = "#000000";
		ctx.fill();
		ctx.closePath();
	}
}