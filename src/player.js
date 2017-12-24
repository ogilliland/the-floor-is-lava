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
	this.parallaxX = 1;
	this.parallaxY = 4;
	this.follow = function(target) {
		this.x = (target.x - canvas.width/2)/this.parallaxX;
		this.y = (target.y - canvas.height/2)/this.parallaxY;
	}
}

function drawPlayer(camera, player) {
	ctx.beginPath();
    ctx.arc(player.x - camera.x, player.y - camera.y, player.radius, 0, Math.PI*2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
}