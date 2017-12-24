function calculateVertX(ox, vx, vy, angle) {
	return ox + vx * Math.cos(angle) - vy * Math.sin(angle);
}

function calculateVertY(oy, vx, vy, angle) {
	return oy + vx * Math.sin(angle) + vy * Math.cos(angle);
}

function simulatePhysics() {
	if(player.control.jump > 0 && player.onGround) {
		player.dy = -20;
		player.onGround = false;
	}
	if(player.control.left - player.control.right > 0) {
		if(player.dx < player.speed) {
			player.dx += player.speed/10;
		}
	} else if (player.control.left - player.control.right < 0) {
		if(player.dx > (-1) * player.speed) {
			player.dx += (-1) * player.speed/10;
		}
	} else {
		player.dx += (-1) * player.dx * friction;
	}
	player.x += player.dx;
	player.y += player.dy;
	player.dy += gravity;
	var activeRock = -1;
	for(var i = 0; i < rocks.length; i++) {
		// rotate rocks
		rocks[i].a += rocks[i].da;
		rocks[i].da = (-0.0005) * rocks[i].a + 0.975 * rocks[i].da;
		// melt rocks
		rocks[i].height += (rocks[i].targetHeight - rocks[i].height)/10;
		rocks[i].y += (rocks[i].targetY - rocks[i].y)/10;
		// make player collide with rock surface
		var leftPoint = calculateVertX(
					rocks[i].x,
					-0.5 * rocks[i].width,
					-0.5 * rocks[i].height,
					rocks[i].a
		)
		var rightPoint = calculateVertX(
					rocks[i].x,
					0.5 * rocks[i].width,
					-0.5 * rocks[i].height,
					rocks[i].a
		)
		if(player.x > leftPoint && player.x < rightPoint) {
			activeRock = i;
			var leftHeight = calculateVertY(
						rocks[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight),
						-0.5 * rocks[i].width,
						-0.5 * rocks[i].height,
						rocks[i].a
			)
			var rightHeight = calculateVertY(
						rocks[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight),
						0.5 * rocks[i].width,
						-0.5 * rocks[i].height,
						rocks[i].a
			)
			var slope = (rightHeight - leftHeight)/(rightPoint - leftPoint);
			var rockSurface = leftHeight + slope * (player.x - leftPoint);
			if((player.y + 20) > rockSurface && (player.y + 20 - player.dy - player.speed) < rockSurface) {
				if(player.onGround) {
					// player is resting on rock
					rocks[i].da += (player.x - rocks[i].x)/1000000;
					rocks[i].melt(meltRate * multiplier);
				} else {
					// player just landed on rock
					if(i > score) {
						score = i;
					}
					rocks[i].da += 2 * player.dy * (player.x - rocks[i].x)/1000000;
					rocks[i].melt(50 * meltRate * multiplier);
					player.onGround = true;
				}
				player.y = rockSurface - 20;
				player.dy = 0;
			}
		}
	}
	if(activeRock == -1) {
		player.onGround = false;
	}
	if(player.y > canvas.height - lavaBottomHeight) {
		player.isAlive = false;
		player.control.jump = 0;
	}
}