var bpm = 100;
var noteLength = 1/32;
var playhead = 0;
var deathRattle = true;
var mute = false;

// store drum sounds for easy access
function drumKit() {
	this.soundQueue = [0, 0, 0, 0, 0]; // tom1, tom2, tom3
	// load sounds
	this.kick = new Howl({
		src: ['sfx/drum_kick.mp3'],
		volume: 0.5
	});
	this.hat = new Howl({
		src: ['sfx/drum_hat.mp3'],
		volume: 0.5
	});
	this.snare = new Howl({
		src: ['sfx/drum_snare.mp3'],
		volume: 0.5
	});
	this.tom1 = new Howl({
		src: ['sfx/drum_tom1.mp3'],
		volume: 0.25
	});
	this.tom2 = new Howl({
		src: ['sfx/drum_tom2.mp3'],
		volume: 0.25
	});
	this.tom3 = new Howl({
		src: ['sfx/drum_tom3.mp3'],
		volume: 0.25
	});
	this.tap = new Howl({
		src: ['sfx/drum_tap.mp3'],
		volume: 0.25
	});
	this.cymbal = new Howl({
		src: ['sfx/drum_cymbal.mp3'],
		volume: 0.5
	});
}

var drums = new drumKit();

var notes = [
	[drums.kick, 1, true],
	[drums.hat, 2, true],
	[drums.snare, 3, true],
	[drums.hat, 4, true]
];

var accents = new Array();
for(var j = 0; j < 16 * 4/noteLength; j++) {
	accents.push([j * 16 * noteLength, true]);
}

function resetDrums() {
	resetNotes();
	playhead = 0;
	deathRattle = true;
}

function resetNotes() {
	for(var i = 0; i < notes.length; i++) {
		notes[i][2] = true;
	}
	for(var j = 0; j < accents.length; j++) {
		accents[j][1] = true;
	}
}

function playDrums() {
	if(!mute) {
		if(!newGame) {
			if(player.isAlive) {
				playhead += (1 + 0.25 * furthest/20) * 1000 * noteLength;
				var rhythm = (playhead/1000) * (bpm/60);
				for(var i = 0; i < notes.length; i++) {
					if(rhythm > notes[i][1] && notes[i][2]) {
						notes[i][0].play();
						notes[i][2] = false;
					}
				}
				for(var j = 0; j < accents.length; j++) {
					if(rhythm > accents[j][0] && accents[j][1]) {
						// play queued notes
						if(drums.soundQueue[2] == 1) {
							// landing sound
							drums.tom1.play();
							drums.soundQueue[2] = 0;
						} else if(drums.soundQueue[1] == 1) {
							// release jump sound
							// drums.tom2.play();
							drums.soundQueue[1] = 0;
						} else if(drums.soundQueue[0] == 1) {
							// jump sound
							drums.tom3.play();
							drums.soundQueue[0] = 0;
						} else if(drums.soundQueue[3] == 1) {
							// right sound
							// drums.tap.play();
							drums.soundQueue[3] = 0;
						} else if(drums.soundQueue[4] == 1) {
							// left sound
							// drums.tap.play();
							drums.soundQueue[4] = 0;
						}
						accents[j][1] = false;
					}
				}
				if(rhythm > 4) {
					playhead = 0;
					resetNotes();
				}
			} else {
				if(deathRattle) {
					drums.cymbal.play();
					deathRattle = false;
				}
			}
		}
	}
}