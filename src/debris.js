// used to define debris objects
function Debris(x, y, width, height, depth) {
	this.x = x;
	this.y = y;
	this.a = 0; // angle relative to horizontal
	this.da = 0; // angular velocity
	this.width = width;
	this.height = height;
	this.depth = depth;
	this.originalHeight = height;
	this.targetHeight = height;
	this.targetY = y;
	this.melt = function(rate) {
		this.targetHeight += (-1) * rate * (this.originalHeight/200 + 0.5);
		this.targetY += rate/2 * (this.originalHeight/200 + 0.5);
		if(this.targetHeight < 0) {
			this.targetY += 4 * (this.height - this.targetHeight);
			this.targetHeight = 0;
		}
	}
}

var debris = new Array();

function addDebris(x, y, width, height, depth) {
	debris.push(new Debris(x, y, width, height, depth));
}

function clearDebris() {
	debris.length = 0;
}

function drawDebris() {
	for(var i = 0; i < debris.length; i++) {
		drawRect(
			debris[i].x - camera.x,
			debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
			0,
			0,
			debris[i].width,
			debris[i].height,
			debris[i].depth,
			debris[i].a,
			debrisMainColor,
			debrisShadowColor
		);
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