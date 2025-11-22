// VOR init() darf nur Code stehen, der keine DOM-Elemente oder Funktionen braucht
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();   // ← verhindert Button-Klick
    }
});


let canvas;
let world;
let keyboard = new Keyboard();
let victoryVideo;

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

	world = new World(canvas, keyboard);
	// Victory & Later Text initialisieren
	winText = new CutsceneText("winText");
	laterText = new CutsceneText("laterText");

	// Video-Klasse
	victoryVideo = new GameVideo("victoryVideo");

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

//start game
function startGame() {
    // 1. Startscreen ausblenden
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";

    // 2. Canvas einblenden
    const canvas = document.getElementById("canvas");
    canvas.style.display = "block";

    // 3. Spiel starten
    init();

    // 4. Touch-Buttons aktivieren (kommt aus js/button.js)
    if (typeof initTouchButtons === 'function') {
        initTouchButtons();
    } else {
        console.warn('initTouchButtons() nicht gefunden – ist js/button.js eingebunden?');
    }
}



// js/button.js
// Initialisiert die Touch-/Maus-Buttons für Mobile & Desktop

function initTouchButtons() {
    const btnLeft  = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump  = document.getElementById('btn-jump');
    const btnThrow = document.getElementById('btn-throw');

    if (!btnLeft || !btnRight || !btnJump || !btnThrow) {
        console.warn('Touch-Buttons nicht gefunden – prüfe IDs in index.html');
        return;
    }

    function safePrevent(e) {
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }

    // --- Aktionen ---
    function pressLeft(e) {
        safePrevent(e);
        keyboard.LEFT = true;
    }
    function releaseLeft(e) {
        safePrevent(e);
        keyboard.LEFT = false;
    }

    function pressRight(e) {
        safePrevent(e);
        keyboard.RIGHT = true;
    }
    function releaseRight(e) {
        safePrevent(e);
        keyboard.RIGHT = false;
    }

    function pressJump(e) {
        safePrevent(e);
        keyboard.SPACE = true;
    }
    function releaseJump(e) {
        safePrevent(e);
        keyboard.SPACE = false;
    }

    function pressThrow(e) {
        safePrevent(e);
        keyboard.D = true;
    }
    function releaseThrow(e) {
        safePrevent(e);
        keyboard.D = false;
    }

    // Helper zum Anhängen
    function attachButton(btn, pressFn, releaseFn) {
        // Touch
        btn.addEventListener('touchstart', pressFn,  { passive: false });
        btn.addEventListener('touchend',   releaseFn, { passive: false });
        btn.addEventListener('touchcancel',releaseFn, { passive: false });

        // Maus (zum Testen am PC)
        btn.addEventListener('mousedown',  pressFn);
        btn.addEventListener('mouseup',    releaseFn);
        btn.addEventListener('mouseleave', releaseFn);
    }

    attachButton(btnLeft,  pressLeft,  releaseLeft);
    attachButton(btnRight, pressRight, releaseRight);
    attachButton(btnJump,  pressJump,  releaseJump);
    attachButton(btnThrow, pressThrow, releaseThrow);

    console.log('Touch-Buttons initialisiert.');
}
