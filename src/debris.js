var rockMainColor = "rgba(85, 85, 85, 1)";
var rockShadowColor = "rgba(70, 70, 70, 1)";
var rockHighlightColor = "rgba(100, 100, 100, 1)";
var woodMainColor = "rgba(120, 60, 0, 1)";
var woodShadowColor = "rgba(100, 50, 0, 1)";
var woodHighlightColor = "rgba(140, 70, 0, 1)";
var fabricMainColor = "rgba(100, 25, 175, 1)";
var fabricShadowColor = "rgba(75, 25, 150, 1)";
var fabricHighlightColor = "rgba(125, 50, 200, 1)";
var lastDebris = -1;
var force2d = false;

function createDebris() {
	while(maxDistance - player.x < canvas.width/2) {
		var debrisType = Math.round(Math.random() * 10);
		if(debrisType == lastDebris) {
			debrisType = debrisType - 1;
		}
		if(debrisType < 0) {
			debrisType = 0;
		}
		var size = debrisSize(debrisType);
		if(maxDistance == 0) {
			maxDistance += (-0.5) * size[0];
		}
		addDebris(camera.width/2 + maxDistance + 0.5 * size[0], debrisType, size);
		lastDebris = debrisType;
		maxDistance += size[0] + multiplier * (0.75 + 0.25 * Math.random()) * camera.width/2;
	}
}

function debrisSize(type) {
	var result = [0, 0, 0];
	switch(type) {
	case 1:
		// wood table
		result = [
			300 + 200 * Math.random(),
			20,
			100,
			20
		];
		break;
	case 2:
		// wood crate
		var cube = 50 * Math.round(Math.random() * 2) + 100;
		result = [
			cube,
			cube,
			cube/2,
			cube/10
		];
		break;
	case 3:
		// inverted wood table
		result = [
			300 + 200 * Math.random(),
			125,
			100,
			20
		];
		break;
	case 4:
		// wood dresser
		result = [
			400,
			225,
			50,
			20
		];
		break;
	case 5:
		// wood bookshelf
		result = [
			400,
			150,
			50,
			20
		];
		break;
	case 6:
		// wood chair
		result = [
			100,
			75,
			75,
			20
		];
		break;
	case 7:
		// wood cabinet
		result = [
			250,
			150,
			50,
			20
		];
		break;
	case 8:
		// fabric sofa
		result = [
			250 + 200 * Math.random(),
			75,
			62.5,
			20
		];
		break;
	case 9:
		// fabric chair
		result = [
			200,
			75,
			62.5,
			20
		];
		break;
	default:
		// rock
		result = [
			300 + 300 * Math.random(),
			25 * Math.round(Math.random() * 2) + 50,
			50,
			0
		];
	}
	return result;
}

// used to define debris objects
function Debris(x, type, size) {
	this.type = type;
	this.a = 0; // angle relative to horizontal
	this.da = 0; // angular velocity
	this.width = size[0];
	this.height = size[1];
	this.depth = size[2];
	this.detailWidth = size[3];
	this.x = x;
	this.y = 65 - this.height/4;
	this.originalHeight = this.height;
	this.targetHeight = this.height;
	this.targetY = this.y;
	this.visible = false;
	this.melt = function(rate) {
		this.targetHeight += (-1) * rate * (this.originalHeight/200 + 0.5);
		this.targetY += rate/4 * (this.originalHeight/200 + 0.5);
		if(this.targetHeight < 10) {
			this.targetY += (this.height - this.targetHeight) * (10 - this.targetHeight)/10;
			if(this.targetHeight < 0) {
				this.targetHeight = 0;
			}
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
				// top surface
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
					woodShadowColor,
					woodHighlightColor
				);
				drawSurface(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].a,
					woodShadowColor
				);
				// back legs
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width - 2 * debris[i].detailWidth,
					-0.5 * debris[i].height - 50,
					0.5 * debris[i].depth - debris[i].detailWidth,
					debris[i].detailWidth,
					100,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width + 2 * debris[i].detailWidth,
					-0.5 * debris[i].height - 50,
					0.5 * debris[i].depth - debris[i].detailWidth,
					debris[i].detailWidth,
					100,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
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
					woodShadowColor,
					woodHighlightColor
				);
				drawSurface(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].a,
					woodShadowColor
				);
				// detail on front face
				if(debris[i].height > 3.5 * debris[i].detailWidth) {
					// top triangle
					ctx.beginPath();
					ctx.moveTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0,
							-0.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0,
							-0.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].width - 1.75 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].width - 1.75 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].width + 1.75 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].width + 1.75 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.fillStyle = woodMainColor;
					ctx.fill();
					ctx.closePath();
					// left triangle
					ctx.beginPath();
					ctx.moveTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.75 * debris[i].detailWidth,
							0,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.75 * debris[i].detailWidth,
							0,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].width + debris[i].detailWidth,
							-0.5 * debris[i].height + 1.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].width + debris[i].detailWidth,
							-0.5 * debris[i].height + 1.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].width + debris[i].detailWidth,
							0.5 * debris[i].height - 1.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].width + debris[i].detailWidth,
							0.5 * debris[i].height - 1.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.fillStyle = woodMainColor;
					ctx.fill();
					ctx.closePath();
					// right triangle
					ctx.beginPath();
					ctx.moveTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.75 * debris[i].detailWidth,
							0,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.75 * debris[i].detailWidth,
							0,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].width - debris[i].detailWidth,
							-0.5 * debris[i].height + 1.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].width - debris[i].detailWidth,
							-0.5 * debris[i].height + 1.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].width - debris[i].detailWidth,
							0.5 * debris[i].height - 1.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].width - debris[i].detailWidth,
							0.5 * debris[i].height - 1.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.fillStyle = woodMainColor;
					ctx.fill();
					ctx.closePath();
					// bottom triangle
					ctx.beginPath();
					ctx.moveTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0,
							0.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0,
							0.75 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].width - 1.75 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].width - 1.75 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].width + 1.75 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].width + 1.75 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.fillStyle = woodMainColor;
					ctx.fill();
					ctx.closePath();
				}
				break;
			case 3:
				// inverted wood table
				// back legs
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width - 2 * debris[i].detailWidth,
					0,
					0.5 * debris[i].depth - debris[i].detailWidth,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width + 2 * debris[i].detailWidth,
					0,
					0.5 * debris[i].depth - debris[i].detailWidth,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				// front legs
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width - 2 * debris[i].detailWidth,
					0,
					-0.5 * debris[i].depth + debris[i].detailWidth,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width + 2 * debris[i].detailWidth,
					0,
					-0.5 * debris[i].depth + debris[i].detailWidth,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				// top surface
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					-1 * debris[i].height/2 + 10,
					0,
					debris[i].width,
					20,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawSurface(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].a,
					woodShadowColor
				);
				break;
			case 4:
				// wood dresser
				// side detail
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width,
					0,
					0.25 * debris[i].depth,
					debris[i].detailWidth,
					debris[i].height + debris[i].detailWidth,
					0.5 * debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width,
					0,
					0.25 * debris[i].depth,
					debris[i].detailWidth,
					debris[i].height + debris[i].detailWidth,
					0.5 * debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				// main body
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
					woodShadowColor,
					woodHighlightColor
				);
				drawSurface(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].a,
					woodShadowColor
				);
				// detail on front face
				if(debris[i].height > 3 * debris[i].detailWidth) {
					// door 1
					ctx.beginPath();
					ctx.moveTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].width - 2 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].width - 2 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].width - 2 * debris[i].detailWidth,
							0.5 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].width - 2 * debris[i].detailWidth,
							0.5 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].width + 2 * debris[i].detailWidth,
							0.5 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].width + 2 * debris[i].detailWidth,
							0.5 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].width + 2 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].width + 2 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.fillStyle = woodMainColor;
					ctx.fill();
					ctx.closePath();
					// door 2
					ctx.beginPath();
					ctx.moveTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].width - 2 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].width - 2 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].width - 2 * debris[i].detailWidth,
							-0.5 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].width - 2 * debris[i].detailWidth,
							-0.5 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].width + 2 * debris[i].detailWidth,
							-0.5 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].width + 2 * debris[i].detailWidth,
							-0.5 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].width + 2 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].width + 2 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.fillStyle = woodMainColor;
					ctx.fill();
					ctx.closePath();
					// handles
					ctx.beginPath();
					ctx.arc(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0,
							-1 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0,
							-1 * debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						debris[i].detailWidth/4,
						0,
						Math.PI*2
					);
					ctx.fillStyle = woodHighlightColor;
					ctx.fill();
					ctx.closePath();
					ctx.beginPath();
					ctx.arc(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0,
							debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0,
							debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						debris[i].detailWidth/4,
						0,
						Math.PI*2
					);
					ctx.fillStyle = woodHighlightColor;
					ctx.fill();
					ctx.closePath();
				}
				break;
			case 5:
				// wood bookshelf
				// background
				ctx.beginPath();
				ctx.moveTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						0.5 * debris[i].width,
						0.5 * debris[i].height,
						debris[i].a
					), 0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						0.5 * debris[i].width,
						0.5 * debris[i].height,
						debris[i].a
					), 0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						0.5 * debris[i].width,
						-0.5 * debris[i].height,
						debris[i].a
					), 0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						0.5 * debris[i].width,
						-0.5 * debris[i].height,
						debris[i].a
					), 0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						-0.5 * debris[i].width,
						-0.5 * debris[i].height,
						debris[i].a
					), 0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						-0.5 * debris[i].width,
						-0.5 * debris[i].height,
						debris[i].a
					), 0.5 * debris[i].depth)
				);
				ctx.lineTo(
					make3dX(calculateVertX(
						debris[i].x - camera.x,
						-0.5 * debris[i].width,
						0.5 * debris[i].height,
						debris[i].a
					), 0.5 * debris[i].depth),
					make3dY(calculateVertY(
						debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
						-0.5 * debris[i].width,
						0.5 * debris[i].height,
						debris[i].a
					), 0.5 * debris[i].depth)
				);
				ctx.fillStyle = woodShadowColor;
				ctx.fill();
				ctx.closePath();
				// base
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0.5 * debris[i].height + debris[i].detailWidth/2,
					0,
					debris[i].width + debris[i].detailWidth,
					debris[i].detailWidth,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				// shelves
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.25 * debris[i].width,
					0,
					0,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					0,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.25 * debris[i].width,
					0,
					0,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				// sides
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width,
					0,
					0,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width,
					0,
					0,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				// top
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					-0.5 * debris[i].height + debris[i].detailWidth/2,
					0,
					debris[i].width + debris[i].detailWidth,
					debris[i].detailWidth,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawSurface(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].a,
					woodShadowColor
				);
				break;
			case 6:
				// wood chair
				// back legs
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width - 0.5 * debris[i].detailWidth,
					0,
					debris[i].depth/2,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width + 0.5 * debris[i].detailWidth,
					0,
					debris[i].depth/2,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				// front legs
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width - 0.5 * debris[i].detailWidth,
					0,
					-1 * debris[i].depth/2,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width + 0.5 * debris[i].detailWidth,
					0,
					-1 * debris[i].depth/2,
					debris[i].detailWidth,
					debris[i].height,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				// top surface
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					-1 * debris[i].height/2 + 0.5 * debris[i].detailWidth,
					0,
					debris[i].width,
					debris[i].detailWidth,
					debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				// back surface
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					-1 * debris[i].height/2 - 90/2,
					debris[i].depth/2,
					debris[i].width,
					90,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawSurface(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].a,
					woodShadowColor
				);
				break;
			case 7:
				// wood cabinet
				// main body
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
					woodShadowColor,
					woodHighlightColor
				);
				drawSurface(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].a,
					woodShadowColor
				);
				// detail on front face
				if(debris[i].height > 2 * debris[i].detailWidth) {
					// door 1
					ctx.beginPath();
					ctx.moveTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].width - debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].width - debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							0.5 * debris[i].width - debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							0.5 * debris[i].width - debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.fillStyle = woodMainColor;
					ctx.fill();
					ctx.closePath();
					// door 2
					ctx.beginPath();
					ctx.moveTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].width + debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].width + debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].detailWidth,
							0.5 * debris[i].height - debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.lineTo(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-0.5 * debris[i].width + debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-0.5 * debris[i].width + debris[i].detailWidth,
							-0.5 * debris[i].height + debris[i].detailWidth,
							debris[i].a
						), -0.5 * debris[i].depth)
					);
					ctx.fillStyle = woodMainColor;
					ctx.fill();
					ctx.closePath();
					// handles
					ctx.beginPath();
					ctx.arc(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							-1 * debris[i].detailWidth,
							0,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							-1 * debris[i].detailWidth,
							0,
							debris[i].a
						), -0.5 * debris[i].depth),
						debris[i].detailWidth/4,
						0,
						Math.PI*2
					);
					ctx.fillStyle = woodHighlightColor;
					ctx.fill();
					ctx.closePath();
					ctx.beginPath();
					ctx.arc(
						make3dX(calculateVertX(
							debris[i].x - camera.x,
							debris[i].detailWidth,
							0,
							debris[i].a
						), -0.5 * debris[i].depth),
						make3dY(calculateVertY(
							debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
							debris[i].detailWidth,
							0,
							debris[i].a
						), -0.5 * debris[i].depth),
						debris[i].detailWidth/4,
						0,
						Math.PI*2
					);
					ctx.fillStyle = woodHighlightColor;
					ctx.fill();
					ctx.closePath();
				}
				break;
			case 8:
				// fabric sofa
				// main body
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
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				// left arm
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width + 0.5 * debris[i].detailWidth,
					-0.5 * debris[i].detailWidth,
					-0.5 * debris[i].depth,
					debris[i].detailWidth,
					debris[i].height + debris[i].detailWidth,
					debris[i].detailWidth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				drawCircle(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width,
					-0.5 * debris[i].height - 0.5 * debris[i].detailWidth,
					0,
					2 * debris[i].detailWidth,
					debris[i].depth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				// right arm
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width - 0.5 * debris[i].detailWidth,
					-0.5 * debris[i].detailWidth,
					-0.5 * debris[i].depth,
					debris[i].detailWidth,
					debris[i].height + debris[i].detailWidth,
					debris[i].detailWidth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				drawCircle(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width,
					-0.5 * debris[i].height - 0.5 * debris[i].detailWidth,
					0,
					2 * debris[i].detailWidth,
					debris[i].depth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				// back
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					-0.5 * debris[i].height - 50,
					0.5 * debris[i].depth - 0.5 * debris[i].detailWidth,
					debris[i].width - 1.5 *  debris[i].detailWidth,
					100,
					debris[i].detailWidth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				drawSurface(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].a,
					fabricShadowColor
				);
				// TODO - add cushion detail
				break;
			case 9:
				// fabric chair
				// main body
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
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				// left arm
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width + 0.5 * debris[i].detailWidth,
					-0.5 * debris[i].detailWidth,
					-0.5 * debris[i].depth,
					debris[i].detailWidth,
					debris[i].height + debris[i].detailWidth,
					debris[i].detailWidth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				drawCircle(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width,
					-0.5 * debris[i].height - 0.5 * debris[i].detailWidth,
					0,
					2 * debris[i].detailWidth,
					debris[i].depth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				// right arm
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width - 0.5 * debris[i].detailWidth,
					-0.5 * debris[i].detailWidth,
					-0.5 * debris[i].depth,
					debris[i].detailWidth,
					debris[i].height + debris[i].detailWidth,
					debris[i].detailWidth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				drawCircle(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width,
					-0.5 * debris[i].height - 0.5 * debris[i].detailWidth,
					0,
					2 * debris[i].detailWidth,
					debris[i].depth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				// back
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					-0.5 * debris[i].height - 50,
					0.5 * debris[i].depth - 0.5 * debris[i].detailWidth,
					debris[i].width - 1.5 *  debris[i].detailWidth,
					100,
					debris[i].detailWidth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				drawSurface(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].a,
					fabricShadowColor
				);
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
					rockShadowColor,
					rockHighlightColor
				);
				drawSurface(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0,
					0,
					debris[i].width,
					debris[i].height,
					debris[i].a,
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
				// wood table
				// front legs
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width - 2 * debris[i].detailWidth,
					-0.5 * debris[i].height - 50,
					-0.5 * debris[i].depth + debris[i].detailWidth,
					debris[i].detailWidth,
					100,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width + 2 * debris[i].detailWidth,
					-0.5 * debris[i].height - 50,
					-0.5 * debris[i].depth + debris[i].detailWidth,
					debris[i].detailWidth,
					100,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				break;
			case 4:
				// wood dresser
				// side detail
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width,
					0,
					-0.25 * debris[i].depth,
					debris[i].detailWidth,
					debris[i].height + debris[i].detailWidth,
					0.5 * debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				drawRect(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width,
					0,
					-0.25 * debris[i].depth,
					debris[i].detailWidth,
					debris[i].height + debris[i].detailWidth,
					0.5 * debris[i].depth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
				);
				break;
			case 8:
				// fabric sofa
				drawCircle(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width,
					-0.5 * debris[i].height - 0.5 * debris[i].detailWidth,
					-0.25 * debris[i].depth,
					2 * debris[i].detailWidth,
					0.5 * debris[i].depth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				drawCircle(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width,
					-0.5 * debris[i].height - 0.5 * debris[i].detailWidth,
					-0.25 * debris[i].depth,
					2 * debris[i].detailWidth,
					0.5 * debris[i].depth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				break;
			case 9:
				// fabric chair
				drawCircle(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					0.5 * debris[i].width,
					-0.5 * debris[i].height - 0.5 * debris[i].detailWidth,
					-0.25 * debris[i].depth,
					2 * debris[i].detailWidth,
					0.5 * debris[i].depth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
				drawCircle(
					debris[i].x - camera.x,
					debris[i].y - camera.y - lavaMainHeight - lavaSurfaceHeight + canvas.height,
					-0.5 * debris[i].width,
					-0.5 * debris[i].height - 0.5 * debris[i].detailWidth,
					-0.25 * debris[i].depth,
					2 * debris[i].detailWidth,
					0.5 * debris[i].depth,
					debris[i].a,
					fabricMainColor,
					fabricShadowColor,
					fabricHighlightColor
				);
			default:
				// do nothing
			}
		}
	}
}

function drawSurface(ox, oy, x, y, width, height, angle, color) {
	if(force2d) {
		// this is only necessary in 2d mode
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(
			calculateVertX(
				ox,
				x + 0.5 * width,
				y - 0.5 * height,
				angle
			),
			calculateVertY(
				oy,
				x + 0.5 * width,
				y - 0.5 * height,
				angle
			),
		);
		ctx.lineTo(
			calculateVertX(
				ox,
				x - 0.5 * width,
				y - 0.5 * height,
				angle
			),
			calculateVertY(
				oy,
				x - 0.5 * width,
				y - 0.5 * height,
				angle
			),
		);
		ctx.strokeStyle = color;
		ctx.stroke();
		ctx.closePath();
	}
}

function drawRect(ox, oy, x, y, z, width, height, depth, angle, c1, c2, c3) {
	if(force2d) {
		// draw 2d rectangle
		ctx.lineWidth = 5;
		// front face
		ctx.beginPath();
		ctx.moveTo(
			calculateVertX(
				ox,
				x + 0.5 * width,
				y + 0.5 * height,
				angle
			),
			calculateVertY(
				oy,
				x + 0.5 * width,
				y + 0.5 * height,
				angle
			)
		);
		ctx.lineTo(
			calculateVertX(
				ox,
				x + 0.5 * width,
				y - 0.5 * height,
				angle
			),
			calculateVertY(
				oy,
				x + 0.5 * width,
				y - 0.5 * height,
				angle
			),
		);
		ctx.lineTo(
			calculateVertX(
				ox,
				x - 0.5 * width,
				y - 0.5 * height,
				angle
			),
			calculateVertY(
				oy,
				x - 0.5 * width,
				y - 0.5 * height,
				angle
			),
		);
		ctx.lineTo(
			calculateVertX(
				ox,
				x - 0.5 * width,
				y + 0.5 * height,
				angle
			),
			calculateVertY(
				oy,
				x - 0.5 * width,
				y + 0.5 * height,
				angle
			),
		);
		ctx.strokeStyle = c1;
		ctx.stroke();
		ctx.fillStyle = c3;
		ctx.fill();
		ctx.closePath();
	} else {
		// draw 3d rectangle
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
		ctx.strokeStyle = c3;
		ctx.stroke();
		ctx.fillStyle = c3;
		ctx.fill();
		ctx.closePath();
	}
}

function drawCircle(ox, oy, x, y, z, diameter, depth, angle, c1, c2, c3) {
	if(force2d) {
		// draw 2d circle
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.arc(
			calculateVertX(
				ox,
				x,
				y,
				angle
			),
			calculateVertY(
				oy,
				x,
				y,
				angle
			),
			diameter/2,
			0,
			Math.PI*2
		);
		ctx.strokeStyle = c1;
		ctx.stroke();
		ctx.fillStyle = c3;
		ctx.fill();
		ctx.closePath();
	} else {
		// draw 3d circle
		ctx.lineWidth = 1;
		// back face
		ctx.beginPath();
		ctx.arc(
			make3dX(calculateVertX(
				ox,
				x,
				y,
				angle
			), z + 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x,
				y,
				angle
			), z + 0.5 * depth),
			diameter/2,
			0,
			Math.PI*2
		);
		ctx.strokeStyle = c2;
		ctx.stroke();
		ctx.fillStyle = c2;
		ctx.fill();
		ctx.closePath();
		// connection
		// top face
		ctx.beginPath();
		ctx.moveTo(
			make3dX(calculateVertX(
				ox,
				x + diameter/3,
				y - diameter/3,
				angle
			), z - 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x + diameter/3,
				y - diameter/3,
				angle
			), z - 0.5 * depth)
		);
		ctx.lineTo(
			make3dX(calculateVertX(
				ox,
				x + diameter/3,
				y - diameter/3,
				angle
			), z + 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x + diameter/3,
				y - diameter/3,
				angle
			), z + 0.5 * depth)
		);
		ctx.lineTo(
			make3dX(calculateVertX(
				ox,
				x - diameter/3,
				y - diameter/3,
				angle
			), z + 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x - diameter/3,
				y - diameter/3,
				angle
			), z + 0.5 * depth)
		);
		ctx.lineTo(
			make3dX(calculateVertX(
				ox,
				x - diameter/3,
				y - diameter/3,
				angle
			), z - 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x - diameter/3,
				y - diameter/3,
				angle
			), z - 0.5 * depth)
		);
		ctx.strokeStyle = c2;
		ctx.stroke();
		ctx.fillStyle = c2;
		ctx.fill();
		ctx.closePath();
		// bottom face
		ctx.beginPath();
		ctx.lineTo(
			make3dX(calculateVertX(
				ox,
				x + diameter/3,
				y + diameter/3,
				angle
			), z - 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x + diameter/3,
				y + diameter/3,
				angle
			), z - 0.5 * depth)
		);
		ctx.lineTo(
			make3dX(calculateVertX(
				ox,
				x + diameter/3,
				y + diameter/3,
				angle
			), z + 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x + diameter/3,
				y + diameter/3,
				angle
			), z + 0.5 * depth)
		);
		ctx.lineTo(
			make3dX(calculateVertX(
				ox,
				x - diameter/3,
				y + diameter/3,
				angle
			), z + 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x - diameter/3,
				y + diameter/3,
				angle
			), z + 0.5 * depth)
		);
		ctx.lineTo(
			make3dX(calculateVertX(
				ox,
				x - diameter/3,
				y + diameter/3,
				angle
			), z - 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x - diameter/3,
				y + diameter/3,
				angle
			), z - 0.5 * depth)
		);
		ctx.strokeStyle = c2;
		ctx.stroke();
		ctx.fillStyle = c2;
		ctx.fill();
		ctx.closePath();
		// infill
		ctx.beginPath();
		ctx.moveTo(
			make3dX(calculateVertX(
				ox,
				x,
				y - diameter/2,
				angle
			), z - 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x,
				y - diameter/2,
				angle
			), z - 0.5 * depth)
		);
		ctx.lineTo(
			make3dX(calculateVertX(
				ox,
				x,
				y - diameter/2,
				angle
			), z + 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x,
				y - diameter/2,
				angle
			), z + 0.5 * depth)
		);
		ctx.lineTo(
			make3dX(calculateVertX(
				ox,
				x,
				y + diameter/2,
				angle
			), z + 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x,
				y + diameter/2,
				angle
			), z + 0.5 * depth)
		);
		ctx.lineTo(
			make3dX(calculateVertX(
				ox,
				x,
				y + diameter/2,
				angle
			), z - 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x,
				y + diameter/2,
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
		ctx.arc(
			make3dX(calculateVertX(
				ox,
				x,
				y,
				angle
			), z - 0.5 * depth),
			make3dY(calculateVertY(
				oy,
				x,
				y,
				angle
			), z - 0.5 * depth),
			diameter/2,
			0,
			Math.PI*2
		);
		ctx.strokeStyle = c3;
		ctx.stroke();
		ctx.fillStyle = c3;
		ctx.fill();
		ctx.closePath();
	}
}