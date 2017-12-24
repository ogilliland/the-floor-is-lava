var titleColor = "rgba(255, 255, 255, 1)";
var textColor = "rgba(200, 200, 200, 1)";

function drawScore() {
	ctx.font = "100 24px sans-serif";
	ctx.fillStyle = textColor;
	var textWidth = ctx.measureText(score).width;
	ctx.fillText(score, (canvas.width/2) - (textWidth/2), 50);
	ctx.font = "100 12px sans-serif";
	ctx.fillStyle = textColor;
	var textWidth = ctx.measureText("x" + multiplier).width;
	ctx.fillText("x" + multiplier, (canvas.width/2) - (textWidth/2), 75);
}

function drawSplashScreen() {
	ctx.beginPath();
	ctx.rect(
		0,
		0,
		canvas.width,
		canvas.height
	);
	ctx.fillStyle = "rgba(0, 0, 0, 1)";
	ctx.fill();
	ctx.closePath();
	// text
	ctx.font = "100 50px sans-serif";
	ctx.fillStyle = titleColor;
	var title = "THE FLOOR IS LAVA!";
	var titleWidth = ctx.measureText(title).width;
	ctx.fillText(title, (canvas.width/2) - (titleWidth/2), (canvas.height/2) - 25);
	ctx.font = "100 24px sans-serif";
	var text = "Press jump to begin...";
	var textWidth = ctx.measureText(text).width;
	ctx.fillStyle = titleColor;
	ctx.fillText(text, (canvas.width/2) - (textWidth/2), (canvas.height/2) + 100);

}

function drawGameOver() {
	ctx.beginPath();
	ctx.rect(
		0,
		0,
		canvas.width,
		canvas.height
	);
	ctx.fillStyle = "rgba(0, 0, 0, 1)";
	ctx.fill();
	ctx.closePath();
	// text
	ctx.font = "100 50px sans-serif";
	ctx.fillStyle = titleColor;
	var title = "YOU SCORED " + score + " POINTS";
	var titleWidth = ctx.measureText(title).width;
	ctx.fillText(title, (canvas.width/2) - (titleWidth/2), (canvas.height/2) - 25);
	ctx.font = "100 24px sans-serif";
	var text = "Press jump to try again...";
	var textWidth = ctx.measureText(text).width;
	ctx.fillStyle = titleColor;
	ctx.fillText(text, (canvas.width/2) - (textWidth/2), (canvas.height/2) + 100);
}