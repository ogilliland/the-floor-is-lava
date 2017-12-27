var titleColor = "rgba(250, 250, 250, 1)"; // same as game background color
var textColor = "rgba(100, 100, 100, 1)"; // same as rock color

function drawScore() {
	ctx.font = "100 24px sans-serif";
	ctx.fillStyle = textColor;
	var scoreText = score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	var textWidth = ctx.measureText(scoreText).width;
	ctx.fillText(scoreText, (canvas.width/2) - (textWidth/2), 50);
	ctx.font = "100 12px sans-serif";
	ctx.fillStyle = textColor;
	textWidth = ctx.measureText("x" + multiplier).width;
	ctx.fillText("x" + multiplier, (canvas.width/2) - (textWidth/2), 75);
	// add option text
	ctx.font = "100 12px sans-serif";
	ctx.lineWidth = 1;
	if(!mute) {
		ctx.fillStyle = textColor;
		ctx.strokeStyle = textColor;
	} else {
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = "#000000";
	}
	textWidth = ctx.measureText("Mute").width;
	ctx.fillText("Mute", canvas.width - textWidth - 25, 35);
	ctx.beginPath();
	ctx.moveTo(canvas.width - textWidth - 25, 38);
	ctx.lineTo(canvas.width - textWidth - 16, 38);
	ctx.stroke();
	if(!force2d) {
		ctx.fillStyle = textColor;
		ctx.strokeStyle = textColor;
	} else {
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = "#000000";
	}
	textWidth = ctx.measureText("No 3D").width;
	ctx.fillText("No 3D", 25, 35);
	ctx.beginPath();
	ctx.moveTo(25, 38);
	ctx.lineTo(35, 38);
	ctx.stroke();
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
	var text = "Press ENTER to begin...";
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
	if(score == 0) {
		var scoreText = "ZERO";
	} else {
		var scoreText = score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	var title1 = "YOU SCORED";
	var title2 =  scoreText + " POINTS";
	var title1Width = ctx.measureText(title1).width;
	ctx.fillText(title1, canvas.width/2 - title1Width/2, canvas.height/2 - 55);
	var title2Width = ctx.measureText(title2).width;
	ctx.fillText(title2, canvas.width/2 - title2Width/2, canvas.height/2 + 5);
	ctx.font = "100 24px sans-serif";
	var text = "Press ENTER to try again...";
	var textWidth = ctx.measureText(text).width;
	ctx.fillStyle = titleColor;
	ctx.fillText(text, (canvas.width/2) - (textWidth/2), (canvas.height/2) + 100);
}