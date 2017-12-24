// used to define rock objects
function Rock(x, y, width, height) {
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

var rocks = new Array();

function addRock(x, y, width, height) {
	rocks.push(new Rock(x, y, width, height));
}

function clearRocks() {
	rocks.length = 0;
}

function drawRocks() {
	for(var i = 0; i < rocks.length; i++) {
		// front face
		ctx.beginPath();
		ctx.moveTo(
			calculateVertX(
				rocks[i].x - camera.x,
				0.5 * rocks[i].width,
				0.5 * rocks[i].height,
				rocks[i].a
			),
			calculateVertY(
				rocks[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight - camera.y),
				0.5 * rocks[i].width,
				0.5 * rocks[i].height,
				rocks[i].a
			)
		);
		ctx.lineTo(
			calculateVertX(
				rocks[i].x - camera.x,
				0.5 * rocks[i].width,
				-0.5 * rocks[i].height,
				rocks[i].a
			),
			calculateVertY(
				rocks[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight - camera.y),
				0.5 * rocks[i].width,
				-0.5 * rocks[i].height,
				rocks[i].a
			)
		);
		ctx.lineTo(
			calculateVertX(
				rocks[i].x - camera.x,
				-0.5 * rocks[i].width,
				-0.5 * rocks[i].height,
				rocks[i].a
			),
			calculateVertY(
				rocks[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight - camera.y),
				-0.5 * rocks[i].width,
				-0.5 * rocks[i].height,
				rocks[i].a
			)
		);
		ctx.lineTo(
			calculateVertX(
				rocks[i].x - camera.x,
				-0.5 * rocks[i].width,
				0.5 * rocks[i].height,
				rocks[i].a
			),
			calculateVertY(
				rocks[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight - camera.y),
				-0.5 * rocks[i].width,
				0.5 * rocks[i].height,
				rocks[i].a
			)
		);
		ctx.strokeStyle = rockMainColor;
		ctx.stroke();
		ctx.fillStyle = rockMainColor;
		ctx.fill();
		ctx.closePath();
		// top face
		ctx.beginPath();
		ctx.moveTo(
			calculateVertX(
				rocks[i].x - camera.x,
				0.5 * rocks[i].width,
				-0.5 * rocks[i].height,
				rocks[i].a
			),
			calculateVertY(
				rocks[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight - camera.y),
				0.5 * rocks[i].width,
				-0.5 * rocks[i].height,
				rocks[i].a
			)
		);
		ctx.lineTo(
			calculateVertX(
				rocks[i].x - camera.x,
				0.5 * rocks[i].width - 20,
				-0.5 * rocks[i].height - 20,
				rocks[i].a
			),
			calculateVertY(
				rocks[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight - camera.y),
				0.5 * rocks[i].width - 20,
				-0.5 * rocks[i].height - 20,
				rocks[i].a
			)
		);
		ctx.lineTo(
			calculateVertX(
				rocks[i].x - camera.x,
				-0.5 * rocks[i].width + 20,
				-0.5 * rocks[i].height - 20,
				rocks[i].a
			),
			calculateVertY(
				rocks[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight - camera.y),
				-0.5 * rocks[i].width + 20,
				-0.5 * rocks[i].height - 20,
				rocks[i].a
			)
		);
		ctx.lineTo(
			calculateVertX(
				rocks[i].x - camera.x,
				-0.5 * rocks[i].width,
				-0.5 * rocks[i].height,
				rocks[i].a
			),
			calculateVertY(
				rocks[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight - camera.y),
				-0.5 * rocks[i].width,
				-0.5 * rocks[i].height,
				rocks[i].a
			)
		);
		ctx.strokeStyle = rockHighlightColor;
		ctx.stroke();
		ctx.fillStyle = rockHighlightColor;
		ctx.fill();
		ctx.closePath();
	}
}