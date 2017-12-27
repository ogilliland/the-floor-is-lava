function calculateVertX(ox, vx, vy, angle) {
	return ox + vx * Math.cos(angle) - vy * Math.sin(angle);
}

function calculateVertY(oy, vx, vy, angle) {
	return oy + vx * Math.sin(angle) + vy * Math.cos(angle);
}

function make3dX(vx, depth) {
	return vx - depth * (2 * vx / canvas.width - 1);
}

function make3dY(vy, depth) {
	return vy - depth * (0.5 * vy / canvas.height);
}

function simulatePhysics() {
	if(player.control.jump > 0 && player.onGround) {
		player.dy = -40 * gravity;
		player.onGround = false;
		if(Math.random() > 0.5) {
			// randomise drum variations
			drums.soundQueue[0] = 1;
		}
		drums.soundQueue[1] = -1;
	} else if(!player.onGround) {
		if(player.control.jump == 0) {
			// player released jump key
			if(player.dy < 0) {
				player.dy = player.dy/1.05;
			}
		} else {
			// still holding jump
			if(drums.soundQueue[1] == -1 && player.dy >= 0) {
				if(Math.random() > 0.5) {
					// randomise drum variations
					drums.soundQueue[1] = 1;
				} else {
					drums.soundQueue[1] = 0;
				}
			}
		}
	}
	if(player.control.left - player.control.right > 0) {
		if(player.dx < (multiplier/2 + 0.5) * player.speed) {
			player.dx += (multiplier/2 + 0.5) * player.speed/10;
		}
		if(drums.soundQueue[3] == -1) {
			if(Math.random() > 0.75) {
				// randomise drum variations
				drums.soundQueue[3] = 1;
			} else {
				drums.soundQueue[3] = 0;
			}
		}
	} else if (player.control.left - player.control.right < 0) {
		if(player.dx > (-1) * (multiplier/2 + 0.5) * player.speed) {
			player.dx += (-1) * (multiplier/2 + 0.5) * player.speed/10;
		}
		if(drums.soundQueue[4] == -1) {
			if(Math.random() > 0.75) {
				// randomise drum variations
				drums.soundQueue[4] = 1;
			} else {
				drums.soundQueue[4] = 0;
			}
		}
	} else {
		player.dx += (-1) * player.dx * friction;
		drums.soundQueue[3] = -1;
		drums.soundQueue[4] = -1;
	}
	player.x += player.dx;
	player.y += player.dy;
	player.dy += gravity;
	var activePlatform = -1;
	for(var i = 0; i < debris.length; i++) {
		if(debris[i].visible) {
			// rotate debris
			debris[i].a += debris[i].da;
			debris[i].da = (-0.0005) * debris[i].a + 0.975 * debris[i].da;
			// melt debris
			debris[i].height += (debris[i].targetHeight - debris[i].height)/10;
			debris[i].y += (debris[i].targetY - debris[i].y)/10;
			// make player collide with debris surface
			var leftPoint = calculateVertX(
						debris[i].x,
						-0.5 * debris[i].width,
						-0.5 * debris[i].height,
						debris[i].a
			)
			var rightPoint = calculateVertX(
						debris[i].x,
						0.5 * debris[i].width,
						-0.5 * debris[i].height,
						debris[i].a
			)
			if(player.x > leftPoint && player.x < rightPoint) {
				activePlatform = i;
				var leftHeight = calculateVertY(
							debris[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight),
							-0.5 * debris[i].width,
							-0.5 * debris[i].height,
							debris[i].a
				)
				var rightHeight = calculateVertY(
							debris[i].y + (canvas.height - lavaMainHeight - lavaSurfaceHeight),
							0.5 * debris[i].width,
							-0.5 * debris[i].height,
							debris[i].a
				)
				var slope = (rightHeight - leftHeight)/(rightPoint - leftPoint);
				var platformSurface = leftHeight + slope * (player.x - leftPoint);
				if(player.y > platformSurface && (player.y - player.dy - player.speed) < platformSurface) {
					if(player.onGround) {
						// player is resting on surface
						debris[i].da += (player.x - debris[i].x)/(1000 * debris[i].width);
						debris[i].melt(meltRate * multiplier);
					} else {
						// player just landed on surface
						if(i > furthest) {
							score += (i - furthest) * multiplier * 100;
							furthest = i;
							multiplier = 1 + 0.25 * Math.floor(i/10);
						}
						debris[i].da += 2 * player.dy * (player.x - debris[i].x)/(1000 * debris[i].width);
						debris[i].melt(50 * meltRate * multiplier);
						player.onGround = true;
						if(Math.random() > 0.5) {
							// randomise drum variations
							drums.soundQueue[2] = 1;
						}
					}
					player.y = platformSurface;
					player.dy = 0;
				}
			}
		}
	}
	if(activePlatform == -1) {
		player.onGround = false;
	}
	if(player.y - 10 > canvas.height - lavaBottomHeight) {
		player.isAlive = false;
		player.control.return = 0;
	}
}