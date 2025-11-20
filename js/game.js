// VOR init() darf nur Code stehen, der keine DOM-Elemente oder Funktionen braucht

let canvas;
let world;
let keyboard = new Keyboard();

// 🔥 KORREKTUR: Sounds werden JETZT erst beim Laden der Seite initialisiert.
const ALL_GAME_SOUNDS = {
	'jump': 'audio/jump.mp3',
	'hurtPepe': 'audio/hurt.mp3',  /////// Anedern
	'deadPepe': 'audio/deadPepe.mp3',
	"bottleThrow": "audio/bottleThrow.mp3",
	"coinSelect": "audio/coinSelect.mp3",
	'bottleCollect': 'audio/bottleCollect.mp3',
	'chickKill': 'audio/chickKill.mp3',
	'extraBottle': 'audio/extraBottle.mp3',
	"hurtEndboss": 'audio/hurtEndboss.mp3',
	"walkingPepe": 'audio/walking_pepe.mp3',
	"bottleBreak": "audio/brokenBottle.mp3",
	'bossMusic': 'audio/endbossMusic.mp3',
	'youLose': 'audio/youLose.mp3',

	'victory': 'audio/win.mp3',


	'music': 'audio/musik.mp3' // ⬅️ HIER IST DEINE HINTERGRUNDMUSIK
};


function init() {
	canvas = document.getElementById("canvas");

	// 1. SOUNDS HIER LADEN (Nachdem init() aufgerufen wurde)
	SoundManager.loadSounds(ALL_GAME_SOUNDS);

	// 2. WORLD STARTEN
	world = new World(canvas, keyboard);

	// 🔥 HIER MUSST DU DIE MUSIK STARTEN (mit reduzierter Lautstärke 0.4)
	SoundManager.startBackgroundMusic('music', 0.1);

	// OPTIONAL: Eine Taste drücken, um Sounds freizugeben
	console.log("Spiel gestartet. Drücke eine Taste (z.B. SPACE), um Sounds freizugeben.");
};

window.addEventListener('keydown', (event) => {
	// Wenn das Spiel noch nicht gestartet ist, hier nicht abspielen, aber den Mute-Status prüfen!
	// Wir nutzen die globalen Listener.

	if (event.keyCode == 39) {
		keyboard.RIGHT = true;
	}
	if (event.keyCode == 37) {
		keyboard.LEFT = true;
	}
	if (event.keyCode == 38) {
		keyboard.UP = true;
	}
	if (event.keyCode == 40) {
		keyboard.DOWN = true;
	}
	if (event.keyCode == 32) {
		keyboard.SPACE = true;
	}
	if (event.keyCode == 68) {
		keyboard.D = true;
	}
});

window.addEventListener('keyup', (event) => {
	if (event.keyCode == 39) {
		keyboard.RIGHT = false;
	}
	if (event.keyCode == 37) {
		keyboard.LEFT = false;
	}
	if (event.keyCode == 38) {
		keyboard.UP = false;
	}
	if (event.keyCode == 40) {
		keyboard.DOWN = false;
	}
	if (event.keyCode == 32) {
		keyboard.SPACE = false;
	}
	if (event.keyCode == 68) {
		keyboard.D = false;
	}
}); 