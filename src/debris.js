var rockMainColor = "rgba(85, 85, 85, 1)";
var rockShadowColor = "rgba(70, 70, 70, 1)";
var rockHighlightColor = "rgba(100, 100, 100, 1)";
var woodMainColor = "rgba(120, 60, 0, 1)";
var woodShadowColor = "rgba(100, 50, 0, 1)";
var woodHighlightColor = "rgba(140, 70, 0, 1)";
var fabricMainColor = "rgba(100, 25, 175, 1)";
var fabricShadowColor = "rgba(75, 25, 150, 1)";
var fabricHighlightColor = "rgba(125, 50, 200, 1)";
var lastDebris = 0;
var force2d = false;

function createDebris() {
	while(maxDistance - player.x < canvas.width/2) {
		maxDistance += extraDistance;
		var debrisType = Math.round(Math.random() * 9);
		if(debrisType == lastDebris) {
			debrisType = debrisType - 1;
		}
		if(debrisType < 0) {
			debrisType = 0;
		}
		addDebris(camera.width/2 + maxDistance, debrisType);
		lastDebris = debrisType;
		extraDistance = camera.width/2 * (
			1.5 * (multiplier/4 + 0.75) +
			0.75 * (3 * multiplier/4 + 0.25) * Math.random()
		);
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
			100,
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
	/* case 8:
		// TODO - fabric sofa
		break;
	case 9:
		// TODO - fabric chair
		break; */
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
function Debris(x, type) {
	this.type = type;
	this.a = 0; // angle relative to horizontal
	this.da = 0; // angular velocity
	var size = debrisSize(type);
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
				// detail on front face
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
				// detail on front face
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
					-1 * debris[i].height/2 - debris[i].originalHeight/2,
					debris[i].depth/2,
					debris[i].width,
					debris[i].originalHeight,
					debris[i].detailWidth,
					debris[i].a,
					woodMainColor,
					woodShadowColor,
					woodHighlightColor
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
				// detail on front face
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
				break;
			/* case 8:
				// TODO - fabric sofa
				break;
			case 9:
				// TODO - fabric chair
				break; */
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
			default:
				// do nothing
			}
		}
	}
}

function drawRect(ox, oy, x, y, z, width, height, depth, angle, c1, c2, c3) {
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