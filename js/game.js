/**
 * Prevents the default browser action when the Space key is pressed.
 */
window.addEventListener('keydown', element => {
    if (element.code === 'Space') {
        element.preventDefault()
    }
})

let canvas
let world
let keyboard = new Keyboard()
let victoryVideo
let gameId = 0

const ALL_GAME_SOUNDS = {
    jump: 'audio/jump.mp3',
    hurtPepe: 'audio/hurt.mp3',
    deadPepe: 'audio/deadPepe.mp3',
    bottleThrow: 'audio/bottleThrow.mp3',
    coinSelect: 'audio/coinSelect.mp3',
    bottleCollect: 'audio/bottleCollect.mp3',
    chickKill: 'audio/chickKill.mp3',
    extraBottle: 'audio/extraBottle.mp3',
    hurtEndboss: 'audio/hurtEndboss.mp3',
    walkingPepe: 'audio/walking_pepe.mp3',
    bottleBreak: 'audio/brokenBottle.mp3',
    bossMusic: 'audio/endbossMusic.mp3',
    youLose: 'audio/youLose.mp3',
    victory: 'audio/win.mp3',
    miniChicken: 'audio/mini_chicken.mp3',
    music: 'audio/musik.mp3'
}

/**
 * Restores the saved mute state from localStorage.
 */
function restoreMuteState() {
    const savedMuteState = localStorage.getItem('soundMuted')
    if (savedMuteState === 'true') {
        SoundManager.isMuted = true
        SoundManager.masterVolume = 0
    }
}

/**
 * Initializes the game by loading sounds, creating the world,
 * setting up UI elements, and starting background music.
 */
function init() {
    canvas = document.getElementById('canvas')
    SoundManager.loadSounds(ALL_GAME_SOUNDS)
    restoreMuteState()
    world = new World(canvas, keyboard)
    winText = new CutsceneText('winText')
    laterText = new CutsceneText('laterText')
    victoryVideo = new GameVideo('victoryVideo')
    window.victoryVideoElement = document.getElementById('victoryVideo')
    SoundManager.startBackgroundMusic('music', 0.1)
    const icon = document.getElementById('sound-icon')
    if (icon) {
        icon.src = SoundManager.isMuted ? 'img/volume_off.png' : 'img/volume_on.png'
    }
}

/**
 * Handles key presses and updates the keyboard state based on the pressed key.
 */
window.addEventListener('keydown', event => {
    switch (event.code) {
        case 'ArrowRight':
            keyboard.RIGHT = true
            break
        case 'ArrowLeft':
            keyboard.LEFT = true
            break
        case 'ArrowUp':
            keyboard.UP = true
            break
        case 'ArrowDown':
            keyboard.DOWN = true
            break
        case 'Space':
            keyboard.SPACE = true
            break
        case 'KeyD':
            keyboard.D = true
            break
    }
})

/**
 * Handles key releases and updates the keyboard state when a key is released.
 */
window.addEventListener('keyup', event => {
    switch (event.code) {
        case 'ArrowRight':
            keyboard.RIGHT = false
            break
        case 'ArrowLeft':
            keyboard.LEFT = false
            break
        case 'ArrowUp':
            keyboard.UP = false
            break
        case 'ArrowDown':
            keyboard.DOWN = false
            break
        case 'Space':
            keyboard.SPACE = false
            break
        case 'KeyD':
            keyboard.D = false
            break
    }
})

/**
 * Starts the game.
 * - Hides the start screen and imprint.
 * - Shows the canvas and initializes the game world.
 * - Activates HUD buttons and touch button support.
 */
function startGame() {
    document.querySelector('.impressum-none').classList.add('hidden')
    document.querySelector('.hud-top-right').classList.add('butten-for')
    const startScreen = document.getElementById('start-screen')
    startScreen.style.display = 'none'
    const canvas = document.getElementById('canvas')
    canvas.style.display = 'block'
    document.body.classList.add('game-started')
    init()
    world.gameStarted = true
    checkInitBtn()
}

/**
 * Prüft, ob Touch-Buttons existieren und initialisiert sie.
 * - Verhindert Fehler falls mobile-Steuerung nicht geladen wurde.
 */
function checkInitBtn() {
    if (typeof initTouchButtons === 'function') {
        initTouchButtons()
    } else {
        console.warn(
            'initTouchButtons() nicht gefunden – ist js/button.js eingebunden?'
        )
    }
}

/**
 * Initializes all mobile touch buttons and links them to keyboard controls.
 */
function initTouchButtons() {
    const btnLeft = document.getElementById('btn-left')
    const btnRight = document.getElementById('btn-right')
    const btnJump = document.getElementById('btn-jump')
    const btnThrow = document.getElementById('btn-throw')
    if (!areTouchButtonsAvailable(btnLeft, btnRight, btnJump, btnThrow)) {
        return
    }
    attachButton(
        btnLeft,
        () => (keyboard.LEFT = true),
        () => (keyboard.LEFT = false)
    )
    attachButton(
        btnRight,
        () => (keyboard.RIGHT = true),
        () => (keyboard.RIGHT = false)
    )
    attachButton(
        btnJump,
        () => (keyboard.SPACE = true),
        () => (keyboard.SPACE = false)
    )
    attachButton(
        btnThrow,
        () => (keyboard.D = true),
        () => (keyboard.D = false)
    )
}

/**
 * Checks whether all required touch buttons exist in the DOM.
 * @param {...HTMLElement} buttons - The buttons to verify.
 * @returns {boolean} True if all buttons are present, otherwise false.
 */
function areTouchButtonsAvailable(...buttons) {
    const allPresent = buttons.every(btn => btn)
    if (!allPresent) {
        console.warn('Touch buttons not found – check IDs in index.html')
    }
    return allPresent
}

/**
 * Connects a touch button to press and release actions.
 */
/**
 * Attaches all touch-based controls to a button element.
 * Handles press and release actions for mobile devices.
 *
 * @param {HTMLElement} element - The button element.
 * @param {Function} onPress - Function executed when the button is pressed.
 * @param {Function} onRelease - Function executed when the button is released.
 */
function attachTouchEvents(element, onPress, onRelease) {
    const handlePress = e => {
        if (e && e.cancelable) e.preventDefault()
        onPress()
    }
    const handleRelease = e => {
        if (e && e.cancelable) e.preventDefault()
        onRelease()
    }
    element.addEventListener('touchstart', handlePress, { passive: false })
    element.addEventListener('touchend', handleRelease, { passive: false })
    element.addEventListener('touchcancel', handleRelease, { passive: false })
}

/**
 * Attaches mouse-based controls to a button element.
 * Handles press and release actions for desktop devices.
 *
 * @param {HTMLElement} element - The button element.
 * @param {Function} onPress - Function executed when the button is pressed.
 * @param {Function} onRelease - Function executed when the button is released.
 */
function attachMouseEvents(element, onPress, onRelease) {
    const handlePress = () => onPress()
    const handleRelease = () => onRelease()

    element.addEventListener('mousedown', handlePress)
    element.addEventListener('mouseup', handleRelease)
    element.addEventListener('mouseleave', handleRelease)
}

/**
 * Connects both mouse and touch controls to a button element.
 * Ensures full compatibility across mobile and desktop devices.
 *
 * @param {HTMLElement} element - The button element.
 * @param {Function} onPress - Function executed when the button becomes active.
 * @param {Function} onRelease - Function executed when the button is released.
 */
function attachButton(element, onPress, onRelease) {
    if (!element) return

    attachTouchEvents(element, onPress, onRelease)
    attachMouseEvents(element, onPress, onRelease)
}

/**
 * Returns the player to the start screen by reloading index.html.
 */
function backToStart() {
    stopCurrentGame()
    hideGameElements()
    showStartScreen()
}

/**
 * Restarts the entire game.
 * - Resets everything
 * - Reloads the page (level, enemies, coins, etc. are refreshed)
 */
function resetGame() {
    stopCurrentGame()
    hideGameElements()
    startGame()
}

function stopCurrentGame() {
    gameId++
    SoundManager.stopBackgroundMusic()
    if (world) {
        world.gameOver = true
    }
    world = null
    keyboard = new Keyboard()
    level1 = createLevel1()
}

/**
 * Hides all game-related elements.
 */
function hideGameElements() {
    hideCanvasAndTexts()
    resetVictoryVideo()
    resetCutsceneContainer()
}

/**
 * Hides canvas and all text overlays.
 */
function hideCanvasAndTexts() {
    hideCanvas()
    hideLoseText()
    hideVideoEndMenu()
    hideWinText()
    hideLaterText()
}

/**
 * Hides the game canvas.
 */
function hideCanvas() {
    const canvas = document.getElementById('canvas')
    if (canvas) {
        canvas.style.display = 'none'
    }
}

/**
 * Hides the "lose" text overlay.
 */
function hideLoseText() {
    const loseText = document.getElementById('loseText')
    if (loseText) {
        loseText.classList.add('d-none')
        loseText.style.display = 'none'
    }
}

/**
 * Hides the video end menu overlay.
 */
function hideVideoEndMenu() {
    const videoEndMenu = document.getElementById('videoEndMenu')
    if (videoEndMenu) {
        videoEndMenu.classList.add('d-none')
        videoEndMenu.style.display = 'none'
    }
}

/**
 * Hides the "win" text overlay.
 */
function hideWinText() {
    const winText = document.getElementById('winText')
    if (winText) {
        winText.style.display = 'none'
    }
}

/**
 * Hides the "later" text overlay.
 */
function hideLaterText() {
    const laterText = document.getElementById('laterText')
    if (laterText) {
        laterText.style.display = 'none'
    }
}

/**
 * Stops and hides the victory video.
 */
function resetVictoryVideo() {
    const video = document.getElementById('victoryVideo')
    if (!video) return
    video.pause()
    video.currentTime = 0
    video.style.display = 'none'
}

/**
 * Resets the cutscene container overlay.
 */
function resetCutsceneContainer() {
    const cutsceneContainer = document.getElementById('cutscene-container')
    if (!cutsceneContainer) return
    cutsceneContainer.style.opacity = '0'
    cutsceneContainer.style.pointerEvents = 'none'
}

/**
 * Shows the start screen and restores default UI state.
 */
function showStartScreen() {
    const startScreen = document.getElementById('start-screen')
    startScreen.style.display = 'flex'
    startScreen.classList.remove('d-none')
    document.querySelector('.impressum-none').classList.remove('hidden')
    document.querySelector('.hud-top-right').classList.remove('butten-for')
    document.body.classList.remove('game-started')
}

// Autostart / Start screen decision after loading game.js
; (function () {
    const startScreen = document.getElementById('start-screen')
    const savedMuteState = localStorage.getItem('soundMuted')
    const icon = document.getElementById('sound-icon')
    if (icon && savedMuteState === 'true') {
        icon.src = 'img/volume_off.png'
    }
    startScreen.classList.remove('d-none')
})()
