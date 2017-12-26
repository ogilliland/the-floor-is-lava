// world building
var gravity = 0.5;
var friction = 0.2;
var meltRate = 0.2;
var multiplier = 1;

// the floor is lava
var lavaBottomColor = "rgba(255, 128, 0, 0.875)";
var lavaMainColor = "rgba(255, 128, 0, 1)";
var lavaSurfaceColor = "rgba(255, 192, 0, 1)";
var lavaBottomHeight = 125;
var lavaMainHeight = 200;
var lavaSurfaceHeight = 3;
var debrisMainColor = "rgba(100, 100, 100, 1)";
var debrisShadowColor = "rgba(75, 75, 75, 1)";

function drawBackground(camera) {
	ctx.beginPath();
	ctx.rect(
		0,
		canvas.height - lavaMainHeight - camera.y,
		canvas.width,
		canvas.height
	);
	ctx.strokeStyle = lavaMainColor;
	ctx.stroke();
	ctx.fillStyle = lavaMainColor;
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.rect(
		0,
		canvas.height - lavaMainHeight - lavaSurfaceHeight - camera.y,
		canvas.width,
		lavaSurfaceHeight
	);
	ctx.strokeStyle = lavaSurfaceColor;
	ctx.stroke();
	ctx.fillStyle = lavaSurfaceColor;
	ctx.fill();
	ctx.closePath();
	if(Math.random() > 0.75) {
		addBubble(Math.random()/2 + 0.5, 0);
	}
	for(var i = 0; i < bubbles1.length; i++) {
		drawBubble(bubbles1[i]);
	}
}

function drawForeground(camera) {
	ctx.beginPath();
	ctx.rect(
		0,
		canvas.height - lavaBottomHeight - camera.y,
		canvas.width,
		canvas.height
	);
	ctx.fillStyle = lavaBottomColor;
	ctx.fill();
	ctx.closePath();
	for(var i = 0; i < bubbles2.length; i++) {
		drawBubble(bubbles2[i]);
	}
}

function Bubble(x, y, size, frame) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.frame = frame;
}

var bubbles1 = new Array();
var bubbles2 = new Array();

function addBubble(size, frame) {
	if(Math.random() > 0.25) {
		bubbles2.push(new Bubble(Math.random() * (6 * canvas.width) + camera.x - 3 * canvas.width, Math.random() * 2 * lavaBottomHeight - lavaBottomHeight, size, frame));
	} else {
		bubbles1.push(new Bubble(Math.random() * (6 * canvas.width) + camera.x - 3 * canvas.width, Math.random() * (lavaMainHeight - lavaBottomHeight) + lavaBottomHeight - 10, size, frame));
	}
}

function seedBubbles(count) {
	for(var i = 0; i < count; i++) {
		addBubble(Math.random()/2 + 0.5, Math.round(Math.random() * 600));
	}
}

function clearBubbles() {
	bubbles1.length = 0;
	bubbles2.length = 0;
}

function drawBubble(bubble) {
	if(bubble.frame > 610) {
		// don't draw bubble
	} else {
		// draw base
		var size1 = bubble.frame * bubble.size / 40;
		if(size1 > 10 * bubble.size) {
			size1 = 10 * bubble.size;
		}
		ctx.beginPath();
		ctx.moveTo(
			bubble.x - size1 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.quadraticCurveTo(
			bubble.x - camera.x,
			canvas.height - bubble.y + size1/2 - camera.y,
			bubble.x + size1 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.quadraticCurveTo(
			bubble.x - camera.x,
			canvas.height - bubble.y - 12.5 * size1/(10 * bubble.size) - camera.y,
			bubble.x - size1 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.fillStyle = lavaSurfaceColor;
		ctx.fill();
		ctx.closePath();
		// draw popping animation
		var size2 = (bubble.frame - 600) * bubble.size;
		if(size2 < 0) {
			size2 = 0;
		}
		ctx.beginPath();
		ctx.moveTo(
			bubble.x - size1 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.quadraticCurveTo(
			bubble.x - camera.x,
			canvas.height - bubble.y - 12.5 * size1/(10 * bubble.size) + 2 * size2 - camera.y,
			bubble.x + size1 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.quadraticCurveTo(
			bubble.x - camera.x,
			canvas.height - bubble.y - 12.5 * size1/(10 * bubble.size) - camera.y,
			bubble.x - size1 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.fillStyle = lavaMainColor;
		ctx.fill();
		ctx.closePath();
		bubble.frame += 1;
	}
}