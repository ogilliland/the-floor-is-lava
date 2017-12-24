// world building
var gravity = 0.5;
var friction = 0.2;
var meltRate = 0.2;

// the floor is lava
var lavaBottomColor = "rgba(255, 128, 0, 0.875)";
var lavaMainColor = "rgba(255, 128, 0, 1)";
var lavaSurfaceColor = "rgba(255, 192, 0, 1)";
var lavaBottomHeight = 125;
var lavaMainHeight = 200;
var lavaSurfaceHeight = 3;
var rockMainColor = "rgba(100, 100, 100, 1)";
var rockHighlightColor = "rgba(125, 125, 125, 1)";

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
}