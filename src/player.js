// used to define player object
function Player(height, speed, x, y, dx, dy) {
	this.height = height;
	this.speed = speed;
	this.direction = 1; // 1 = RIGHT, -1 = LEFT
	this.frame = 0; // animation frame
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
	this.return = 0;
}

// used to define camera object
function Camera(width, height) {
	this.x = 0;
	this.y = 0;
	this.width = width;
	this.height = height;
	this.speedX = 4;
	this.speedY = 4;
	this.parallaxX = 0;
	this.parallaxY = 2;
	this.follow = function(target) {
		this.x += (target.x - canvas.width/2 - this.x) * this.speedX/100;
		if(canvas.height > this.height) {
			this.y += ((target.y - canvas.height/2)/this.parallaxY - this.y) * this.speedY/100;
		} else {
			this.y = 0;
		}
	}
	this.snapTo = function(target) {
		this.x = target.x - canvas.width/2;
		this.y = target.y - canvas.height/2;
	}
}

window.onkeyup = function(e) {
	var unicode = e.keyCode ? e.keyCode : e.charCode;
	if(unicode == 37 || unicode == 65) {
		player.control.right = 0;
	}
	if(unicode == 39 || unicode == 68) {
		player.control.left = 0;
	}
	if(unicode == 87 || unicode == 38 || unicode == 32) {
		player.control.jump = 0;
	}
	if(unicode == 13) {
		player.control.return = 0;
	}
}

window.onkeydown = function(e) {
	var unicode = e.keyCode ? e.keyCode : e.charCode;
	if(unicode == 37 || unicode == 65) {
		player.control.right = 1;
	}
	if(unicode == 39 || unicode == 68) {
		player.control.left = 1;
	}
	if(unicode == 87 || unicode == 38 || unicode == 32) {
		player.control.jump = 1;
	}
	if(unicode == 13) {
		player.control.return = 1;
	}
	if(unicode == 77) {
		if(mute) {
			mute = false;
		} else {
			mute = true;
		}
	}
	if(unicode == 78) {
		if(force2d) {
			force2d = false;
		} else {
			force2d = true;
		}
	}
}

function drawPlayer(camera, player) {
	if(player.y - camera.y > 0) {
		if(player.dx < 0) {
			player.direction = -1;
		} else if(player.dx > 0) {
			player.direction = 1;
		}
		if(player.onGround) {
			player.frame += Math.abs(player.dx)/100 * (1 - 0.5 * Math.round(Math.abs(player.frame) * 10)/10);
			if(player.frame >= 1) {
				player.frame = -1;
			}
			var stride = player.frame * Math.abs(player.dx)/player.speed;
		} else {
			var stride = 1.5 * (1 - player.y/(canvas.height - lavaMainHeight - lavaSurfaceHeight));
		}
		// draw player body
		var px = player.x - camera.x;
		var py = player.y - camera.y;
		ctx.lineWidth = 2 * player.weight/player.height;
		ctx.strokeStyle = "#000000";
		// leg 1
		ctx.beginPath();
		ctx.moveTo(
			px,
			py - player.height/3
		);
		ctx.quadraticCurveTo(
			px + 5 * player.height/48 * player.direction * Math.abs(stride),
			py - player.height/6 * Math.abs(stride),
			px + 5 * player.height/48 * player.direction * Math.abs(stride),
			py
		);
		ctx.stroke();
		// leg 2
		ctx.beginPath();
		ctx.moveTo(
			px,
			py - player.height/3
		);
		ctx.quadraticCurveTo(
			px,
			py - player.height/6 * Math.abs(stride),
			px - 5 * player.height/48 * player.direction * Math.abs(stride),
			py
		);
		ctx.stroke();
		// body
		ctx.beginPath();
		ctx.moveTo(
			px,
			py - 2 * player.height/3
		);
		ctx.quadraticCurveTo(
			px - player.height/18 * player.direction * Math.abs(stride),
			py - 3 * player.height/6,
			px,
			py - player.height/3
		);
		ctx.stroke();
		// arm 1
		ctx.beginPath();
		ctx.moveTo(
			px,
			py - 2 * player.height/3
		);
		ctx.quadraticCurveTo(
			px,
			py - 3 * player.height/6,
			px + 3 * player.height/24 * player.direction * Math.abs(stride),
			py - player.height/3
		);
		ctx.stroke();
		// arm 2
		ctx.beginPath();
		ctx.moveTo(
			px,
			py - 2 * player.height/3
		);
		ctx.quadraticCurveTo(
			px - 2 * player.height/12 * player.direction * Math.abs(stride),
			py - 3 * player.height/6,
			px - player.height/12 * player.direction * Math.abs(stride),
			py - player.height/3
		);
		ctx.stroke();
		// head
		ctx.beginPath();
		ctx.arc(px, py - 9 * player.height/12, player.height/12, 0, Math.PI*2);
		ctx.fillStyle = "#000000";
		ctx.fill();
		ctx.closePath();
	} else {
		// draw triangle to represent player
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