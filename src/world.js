// world building
var gravity = 0.5;
var friction = 0.2;
var meltRate = 0.3;

// the floor is lava
var lavaBottomColor = "rgba(255, 128, 0, 0.875)";
var lavaMainColor = "rgba(255, 128, 0, 1)";
var lavaSurfaceColor = "rgba(255, 192, 0, 1)";
var lavaBottomHeight = 125;
var originalBottomHeight = 125;
var lavaMainHeight = 200;
var lavaSurfaceHeight = 3;

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
	if(Math.random() > 0.625) {
		addBubble(0.5 * Math.random() + 0.25, 0);
	}
	for(var i = 0; i < bubbles1.length; i++) {
		drawBubble(bubbles1[i]);
	}
}

function drawForeground(camera) {
	if(force2d) {
		lavaBottomHeight = 140;
	} else {
		lavaBottomHeight = 125;
	}
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
		bubbles2.push(new Bubble(Math.random() * (10 * canvas.width) + camera.x - 5 * canvas.width, Math.random() * 2 * originalBottomHeight - originalBottomHeight, size, frame));
	} else {
		bubbles1.push(new Bubble(Math.random() * (10 * canvas.width) + camera.x - 5 * canvas.width, Math.random() * (lavaMainHeight - originalBottomHeight + 10) + originalBottomHeight - 20, size, frame));
	}
}

function seedBubbles(count) {
	for(var i = 0; i < count; i++) {
		addBubble(0.5 * Math.random() + 0.25, Math.round(Math.random() * 600));
	}
}

function clearBubbles() {
	bubbles1.length = 0;
	bubbles2.length = 0;
}

function drawBubble(bubble) {
	if(bubble.frame > 705) {
		// don't draw bubble
	} else if(bubble.frame > 605) {
		var size3 = (1 + (bubble.frame - 605)/100) * 10 * bubble.size;
		// draw ripple
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(
			bubble.x - size3 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.quadraticCurveTo(
			bubble.x - camera.x,
			canvas.height - bubble.y + size3/2 - camera.y,
			bubble.x + size3 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.quadraticCurveTo(
			bubble.x - camera.x,
			canvas.height - bubble.y - size3/2 - camera.y,
			bubble.x - size3 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.strokeStyle = "rgba(255, 192, 0, " + (705 - bubble.frame)/100 + ")"; // lava surface + alpha
		ctx.stroke();
		ctx.closePath();
		bubble.frame ++;
	} else {
		// draw bubble
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
			canvas.height - bubble.y + 0.5 * size1 - camera.y,
			bubble.x + size1 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.quadraticCurveTo(
			bubble.x - camera.x,
			canvas.height - bubble.y - 1.75 * size1 - camera.y,
			bubble.x - size1 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.fillStyle = lavaSurfaceColor;
		ctx.fill();
		ctx.closePath();
		// draw popping animation
		var size2 = (bubble.frame - 600) * bubble.size * 2;
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
			canvas.height - bubble.y - 1.75 * size1 + 2 * size2 - camera.y,
			bubble.x + size1 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.quadraticCurveTo(
			bubble.x - camera.x,
			canvas.height - bubble.y - 1.75 * size1 - camera.y,
			bubble.x - size1 - camera.x,
			canvas.height - bubble.y - camera.y
		);
		ctx.fillStyle = lavaMainColor;
		ctx.fill();
		ctx.closePath();
		bubble.frame ++;
	}
}