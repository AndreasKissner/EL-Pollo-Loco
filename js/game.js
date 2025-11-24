/**
 * Prevents the default browser action when the Space key is pressed.
 */
window.addEventListener("keydown", (element) => {
    if (element.code === "Space") {
        element.preventDefault();
    }
});

let canvas;
let world;
let keyboard = new Keyboard();
let victoryVideo;

const ALL_GAME_SOUNDS = {
    'jump': 'audio/jump.mp3',
    'hurtPepe': 'audio/hurt.mp3',
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
    'music': 'audio/musik.mp3'
};

/**
 * Initializes the game by loading sounds, creating the world,
 * setting up UI elements, and starting background music.
 */


function init() {
    canvas = document.getElementById("canvas");
    SoundManager.loadSounds(ALL_GAME_SOUNDS);
    world = new World(canvas, keyboard);
    winText = new CutsceneText("winText");
    laterText = new CutsceneText("laterText");
    victoryVideo = new GameVideo("victoryVideo");
    SoundManager.startBackgroundMusic('music', 0.1);
};

/**
 * Handles key presses and updates the keyboard state based on the pressed key.
 */
window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case "ArrowRight": keyboard.RIGHT = true; break;
        case "ArrowLeft": keyboard.LEFT = true; break;
        case "ArrowUp": keyboard.UP = true; break;
        case "ArrowDown": keyboard.DOWN = true; break;
        case "Space": keyboard.SPACE = true; break;
        case "KeyD": keyboard.D = true; break;
    }
});

/**
 * Handles key releases and updates the keyboard state when a key is released.
 */
window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case "ArrowRight": keyboard.RIGHT = false; break;
        case "ArrowLeft": keyboard.LEFT = false; break;
        case "ArrowUp": keyboard.UP = false; break;
        case "ArrowDown": keyboard.DOWN = false; break;
        case "Space": keyboard.SPACE = false; break;
        case "KeyD": keyboard.D = false; break;
    }
});


function startGame() {
    document.querySelector('.impressum-link').classList.add('hidden');
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";
    const canvas = document.getElementById("canvas");
    canvas.style.display = "block";
    init();
    world.gameStarted = true;
    checkInitBtn();
}

function checkInitBtn() {
    if (typeof initTouchButtons === 'function') {
        initTouchButtons();
    } else {
        console.warn('initTouchButtons() nicht gefunden – ist js/button.js eingebunden?');
    }
}

/**
* Initializes all mobile touch buttons and links them to keyboard controls.
*/
function initTouchButtons() {
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump = document.getElementById('btn-jump');
    const btnThrow = document.getElementById('btn-throw');
    if (!areTouchButtonsAvailable(btnLeft, btnRight, btnJump, btnThrow)) {
        return;
    }
    attachButton(btnLeft, () => keyboard.LEFT = true, () => keyboard.LEFT = false);
    attachButton(btnRight, () => keyboard.RIGHT = true, () => keyboard.RIGHT = false);
    attachButton(btnJump, () => keyboard.SPACE = true, () => keyboard.SPACE = false);
    attachButton(btnThrow, () => keyboard.D = true, () => keyboard.D = false);
}

/**
 * Checks whether all required touch buttons exist in the DOM.
 * @param {...HTMLElement} buttons - The buttons to verify.
 * @returns {boolean} True if all buttons are present, otherwise false.
 */
function areTouchButtonsAvailable(...buttons) {
    const allPresent = buttons.every(btn => btn);
    if (!allPresent) {
        console.warn("Touch buttons not found – check IDs in index.html");
    }
    return allPresent;
}

/**
 * Connects a touch button to press and release actions.
 */
function attachButton(element, onPress, onRelease) {
    if (!element) return;
    element.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        onPress();
    });
    element.addEventListener('touchend', (e) => {
        if (e.cancelable) e.preventDefault();
        onRelease();
    });
}

/**
 * Returns the player to the start screen by reloading index.html.
 */
function backToStart() {
    window.location.href = "index.html";
}
