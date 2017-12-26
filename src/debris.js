var rockMainColor = "rgba(100, 100, 100, 1)";
var rockShadowColor = "rgba(75, 75, 75, 1)";
var woodMainColor = "rgba(140, 70, 0, 1)";
var woodShadowColor = "rgba(100, 50, 0, 1)";

function debrisSize(type) {
	var result = [0, 0, 0];
	switch(type) {
	case 1:
		// wood table
		result = [
			300 + 200 * Math.random(),
			25,
			100
		];
		break;
	case 2:
		// wood crate
		var cube = 50 * Math.round(Math.random() * 2) + 100;
		result = [
			cube,
			cube,
			cube/2
		];
		break;
	case 3:
		// TODO - dresser
		break;
	case 4:
		// TODO - book shelf
		break;
	case 5:
		// TODO - chair
		break;
	case 6:
		// TODO - sofa
		break;
	case 7:
		// TODO - inverted table
		break;
	case 8:
		// TODO - cabinet
		break;
	case 9:
		// TODO - tall cabinet
		break;
	default:
		// rock
		result = [
			500,
			25 * Math.round(Math.random() * 2) + 50,
			40
		];
	}
	return result;
}

// used to define debris objects
function Debris(x, type) {
	this.type = type;
	this.a = 0; // angle relative to horizontal
	this.da = 0; // angular velocity
	var size = debrisSize(type);
	this.width = size[0];
	this.height = size[1];
	this.depth = size[2];
	this.x = x;
	this.y = 65 - this.height/4;
	this.originalHeight = this.height;
	this.targetHeight = this.height;
	this.targetY = this.y;
	this.visible = false;
	this.melt = function(rate) {
		this.targetHeight += (-1) * rate * (this.originalHeight/200 + 0.5);
		this.targetY += rate/2 * (this.originalHeight/200 + 0.5);
		if(this.targetHeight < 10) {
			this.targetY += 4 * (this.height - this.targetHeight) * (10 - this.targetHeight)/10;
		}
		if(this.targetHeight < 0) {
			this.targetHeight = 0;
		}
	}
}

var debris = new Array();

function addDebris(x, y, width, height, depth, type) {
	debris.push(new Debris(x, y, width, height, depth, type));
}

function clearDebris() {
	debris.length = 0;
}

function calculateVisibleDebris(camera) {
	for(var i = 0; i < debris.length; i++) {
		// only draw objects that are in frame
		if((debris[i].x + debris[i].width/2 - camera.x > (-1) * camera.width/2) && (debris[i].x - debris[i].width/2 - camera.x < canvas.width + camera.width/2)) {
			debris[i].visible = true;
		} else {
			debris[i].visible = false;
		}
	}
}

function drawDebrisBackground(camera) {
	for(var i = 0; i < debris.length; i++) {
		if(debris[i].visible) {
			switch(debris[i].type) {
			case 1:
				// wood table
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width - 50,
					(-1) * 50 - debris[i].height/2,
					debris[i].depth/4,
					20,
					100,
					20,
					debris[i].a,
					woodMainColor,
					woodShadowColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width + 50,
					(-1) * 50 - debris[i].height/2,
					debris[i].depth/4,
					20,
					100,
					20,
					debris[i].a,
					woodMainColor,
					woodShadowColor
				);
				break;
			case 2:
				// wood crate
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor
				);
				// detail on front face
				var detailWidth = debris[i].width/10;
				// top triangle
				ctx.beginPath();
				ctx.moveTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						0,
						-0.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						0,
						-0.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						0.5 * debris[i].width - 1.75 * detailWidth,
						-0.5 * debris[i].height + detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						0.5 * debris[i].width - 1.75 * detailWidth,
						-0.5 * debris[i].height + detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						-0.5 * debris[i].width + 1.75 * detailWidth,
						-0.5 * debris[i].height + detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						-0.5 * debris[i].width + 1.75 * detailWidth,
						-0.5 * debris[i].height + detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.fillStyle = woodShadowColor;
				ctx.fill();
				ctx.closePath();
				// left triangle
				ctx.beginPath();
				ctx.moveTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						-0.75 * detailWidth,
						0,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						-0.75 * detailWidth,
						0,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						-0.5 * debris[i].width + detailWidth,
						-0.5 * debris[i].height + 1.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						-0.5 * debris[i].width + detailWidth,
						-0.5 * debris[i].height + 1.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						-0.5 * debris[i].width + detailWidth,
						0.5 * debris[i].height - 1.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						-0.5 * debris[i].width + detailWidth,
						0.5 * debris[i].height - 1.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.fillStyle = woodShadowColor;
				ctx.fill();
				ctx.closePath();
				// right triangle
				ctx.beginPath();
				ctx.moveTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						0.75 * detailWidth,
						0,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						0.75 * detailWidth,
						0,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						0.5 * debris[i].width - detailWidth,
						-0.5 * debris[i].height + 1.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						0.5 * debris[i].width - detailWidth,
						-0.5 * debris[i].height + 1.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						0.5 * debris[i].width - detailWidth,
						0.5 * debris[i].height - 1.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						0.5 * debris[i].width - detailWidth,
						0.5 * debris[i].height - 1.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.fillStyle = woodShadowColor;
				ctx.fill();
				ctx.closePath();
				// bottom triangle
				ctx.beginPath();
				ctx.moveTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						0,
						0.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						0,
						0.75 * detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						0.5 * debris[i].width - 1.75 * detailWidth,
						0.5 * debris[i].height - detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						0.5 * debris[i].width - 1.75 * detailWidth,
						0.5 * debris[i].height - detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						-0.5 * debris[i].width + 1.75 * detailWidth,
						0.5 * debris[i].height - detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						-0.5 * debris[i].width + 1.75 * detailWidth,
						0.5 * debris[i].height - detailWidth,
						debris[i].a
					), -0.5 * debris[i].depth)
				);
				ctx.fillStyle = woodShadowColor;
				ctx.fill();
				ctx.closePath();
				break;
			case 3:
				// TODO - dresser
				break;
			case 4:
				// TODO - book shelf
				break;
			case 5:
				// TODO - chair
				break;
			case 6:
				// TODO - sofa
				break;
			case 7:
				// TODO - inverted table
				break;
			case 8:
				// TODO - cabinet
				break;
			case 9:
				// TODO - tall cabinet
				break;
			default:
				// rock
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].depth,
					debris[i].a,
					rockMainColor,
					rockShadowColor
				);
			}
		}
	}
}

function drawDebrisForeground(camera) {
	for(var i = 0; i < debris.length; i++) {
		if(debris[i].visible) {
			switch(debris[i].type) {
			case 1:
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width - 50,
					(-1) * 50 - debris[i].height/2,
					(-1) * debris[i].depth/4,
					20,
					100,
					20,
					debris[i].a,
					woodMainColor,
					woodShadowColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width + 50,
					(-1) * 50 - debris[i].height/2,
					(-1) * debris[i].depth/4,
					20,
					100,
					20,
					debris[i].a,
					woodMainColor,
					woodShadowColor
				);
				break;
			default:
				// do nothing
			}
		}
	}
}

function drawRect(ox, oy, x, y, z, width, height, depth, angle, c1, c2) {
	ctx.lineWidth = 1;
	// right face
	ctx.beginPath();
	ctx.moveTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), z - 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), z - 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), z + 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), z + 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), z + 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), z + 0.5 * depth)
	);
	ctx.strokeStyle = c1;
	ctx.stroke();
	ctx.fillStyle = c1;
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
		), z - 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), z - 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), z + 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), z + 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), z + 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), z + 0.5 * depth)
	);
	ctx.strokeStyle = c1;
	ctx.stroke();
	ctx.fillStyle = c1;
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
		), z - 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), z + 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), z + 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), z + 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), z + 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth)
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
		), z - 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y + 0.5 * height,
			angle
		), z - 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x + 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y - 0.5 * height,
			angle
		), z - 0.5 * depth)
	);
	ctx.lineTo(
		make3dX(calculateVertX(
			ox,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), z - 0.5 * depth),
		make3dY(calculateVertY(
			oy,
			x - 0.5 * width,
			y + 0.5 * height,
			angle
		), z - 0.5 * depth)
	);
	ctx.strokeStyle = c1;
	ctx.stroke();
	ctx.fillStyle = c1;
	ctx.fill();
	ctx.closePath();
}