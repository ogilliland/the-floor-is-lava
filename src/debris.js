// used to define debris objects
function Debris(x, y, width, height, type) {
	this.type = type;
	this.x = x;
	this.y = y;
	this.a = 0; // angle relative to horizontal
	this.da = 0; // angular velocity
	this.width = width;
	this.height = height;
	this.targetHeight = height;
	this.targetY = y;
	this.melt = function(rate) {
		this.targetHeight += (-1) * rate;
		this.targetY += rate/2;
		if(this.targetHeight < 0) {
			this.targetHeight = 0;
			this.targetY = 200;
		}
	}
}

var debris = new Array();

function addDebris(x, y, width, height, type) {
	debris.push(new Debris(x, y, width, height, type));
}

function clearDebris() {
	debris.length = 0;
}

function drawDebris() {
	for(var i = 0; i < debris.length; i++) {
		switch(debris[i].type) {
		case 1:
			drawRect(
				debris[i].x - camera.x,
				debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
				0,
				0,
				debris[i].width,
				debris[i].height,
				20,
				debris[i].a,
				debrisMainColor,
				debrisShadowColor
			);
			drawRect(
				debris[i].x - camera.x,
				debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
				debris[i].width/4,
				(-1.5) * debris[i].height,
				20,
				debris[i].height * 2,
				20,
				debris[i].a,
				debrisMainColor,
				debrisShadowColor
			);
			break;
		default:
			drawRect(
				debris[i].x - camera.x,
				debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
				0,
				0,
				debris[i].width,
				debris[i].height,
				20,
				debris[i].a,
				debrisMainColor,
				debrisShadowColor
			);
		}
	}
}

function drawRect(ox, oy, x, y, width, height, depth, angle, c1, c2) {
	// right face
	ctx.beginPath();
	ctx.moveTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), -0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), -0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), 0.5 * depth)
	);
	ctx.strokeStyle = c2;
	ctx.stroke();
	ctx.fillStyle = c2;
	ctx.fill();
	ctx.closePath();
	// left face
	ctx.beginPath();
	ctx.moveTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), -0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), -0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), 0.5 * depth)
	);
	ctx.strokeStyle = c2;
	ctx.stroke();
	ctx.fillStyle = c2;
	ctx.fill();
	ctx.closePath();
	// top face
	ctx.beginPath();
	ctx.moveTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth)
	);
	ctx.strokeStyle = c2;
	ctx.stroke();
	ctx.fillStyle = c2;
	ctx.fill();
	ctx.closePath();
	// front face
	ctx.beginPath();
	ctx.moveTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), -0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), -0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), -0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), -0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), -0.5 * depth)
	);
	ctx.strokeStyle = c1;
	ctx.stroke();
	ctx.fillStyle = c1;
	ctx.fill();
	ctx.closePath();
}