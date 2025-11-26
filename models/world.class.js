class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    lastThrowTime = 0;
    respawnStopped = false;
    statusBar = new Statusbar();
    statusBarCoins = new StatusbarCoins();
    statusBarBottle = new StatusbarBottle();
    throwableObjects = [];
    floatingTexts = [];
    victoryPlayed = false;
    lossPlayed = false;
    gameOver = false;
    gameStarted = false;

    /**
     * Sets up world and starts render + game loop.
     * @param {HTMLCanvasElement} canvas - Draw surface.
     * @param {Object} keyboard - Key input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.run();
        this.draw();
    }

    /**
     * Assigns world to character + all level objects.
     */
    setWorld() {
        this.character.world = this;
        const allObjects = this.getAllLevelObjects();
        allObjects.forEach(obj => this.prepareWorldObject(obj));
    }

    /**
     * Collects all enemies, coins, bottles and clouds.
     * @returns {Array} Full object list in level.
     */
    getAllLevelObjects() {
        return [
            ...this.level.enemies,
            ...this.level.coins,
            ...this.level.bottles,
            ...this.level.clouds
        ];
    }

    /**
     * Links obj to world and starts animation if exists.
     * @param {Object} obj - Level entity instance.
     */
    prepareWorldObject(obj) {
        obj.world = this;
        if (obj.animate) obj.animate();
    }

    /**
     * Starts core game loop (30 FPS interval).
     */
    run() {
        setInterval(() => this.gameLoop(), 1000 / 30);
    }

    /**
     * Main loop: collisions, throws, respawn, victory, death.
     */
    gameLoop() {
        if (this.gameOver) return;
        this.checkcollision();
        this.checkThrowObjects();
        this.checkRespawn();
        this.checkVictory();
        this.checkGameOverState();
    }

    /**
     * Ends game on character/endboss death.
     */
    checkGameOverState() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (this.character.isDead() || (endboss && endboss.isDead())) {
            this.gameOver = true;
            SoundManager.stopBackgroundMusic();
        }
    }

    /**
     * Respawns enemies when passed or dead.
     */
    checkRespawn() {
        if (this.respawnStopped) return;
        let maxPosition = this.getMaxEnemyPosition();
        this.level.enemies.forEach(enemy => {
            maxPosition = this.respawnEnemyIfNeeded(enemy, maxPosition);
        });
    }

    /**
     * Returns furthest enemy X-position (Endboss excluded).
     * @returns {number} Rightmost enemy coordinate.
     */
    getMaxEnemyPosition() {
        let maxPosition = 720;
        this.level.enemies.forEach(enemy => {
            if (!(enemy instanceof Endboss) && enemy.x > maxPosition) {
                maxPosition = enemy.x;
            }
        });
        return maxPosition;
    }

    /**
     * Repositions enemy if offscreen + resets stats if dead.
     * @param {Object} enemy - Enemy to check.
     * @param {number} maxPosition - Current max spawn X.
     * @returns {number} Updated maxPosition.
     */
    respawnEnemyIfNeeded(enemy, maxPosition) {
        if (enemy instanceof Endboss || enemy.x >= -200) return maxPosition;

        const newX = enemy.generateMinimumDistanceX(
            maxPosition,
            this.level.enemies
        );
        enemy.x = newX;
        maxPosition = newX;

        if (enemy.isDead()) {
            enemy.energy = 100;
            enemy.speed = 0.15 + Math.random() * 0.25;
        }
        return maxPosition;
    }

    /**
     * Checks bottle-throw cooldown + triggers throw.
     */
    checkThrowObjects() {
        if (this.gameOver) return;
        const now = Date.now();
        const cooldown = 1500;
        if (this.canThrowBottle(now, cooldown)) this.throwBottle(now);
    }

    /**
     * Returns true if cooldown passed + bottle available.
     * @param {number} now - Current timestamp.
     * @param {number} cooldown - Throw delay in ms.
     */
    canThrowBottle(now, cooldown) {
        return (
            this.keyboard.D &&
            now - this.lastThrowTime >= cooldown &&
            this.character.bottles > 0
        );
    }

    /**
     * Spawns bottle object and updates bottle UI.
     * @param {number} now - Timestamp for cooldown reset.
     */
    throwBottle(now) {
        this.lastThrowTime = now;
        const direction = this.character.otherDirection ? -1 : 1;
        const offsetX = direction === 1 ? 100 : -30;
        const bottle = new ThrowableObject(
            this.character.x + offsetX,
            this.character.y + 95,
            direction
        );
        this.throwableObjects.push(bottle);
        this.character.bottles--;
        this.statusBarBottle.setPercentage(this.character.bottles);
    }

    /**
     * Handles all collision-type interactions each frame.
     */
    checkcollision() {
        this.throwableObjects.forEach(bottle => {
            bottle.checkEnemyCollisions(this.level.enemies);
        });
        this.character.checkEnemyCollisions(this.level.enemies, this.statusBar);
        this.character.checkCoinCollisions(
            this.level.coins,
            this.statusBarCoins,
            this.statusBarBottle,
            this.floatingTexts
        );
        this.character.checkGroundBottleCollisions(
            this.level.bottles,
            this.statusBarBottle
        );
        this.character.checkPlatformCollisions(this.level.platforms);
    }

    /**
     * Renders frame, UI + schedules next draw.
     */
    draw() {
        this.clearCanvas();
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.restore();
        this.drawUI();
        this.scheduleNextFrame();
    }

    /**
     * Clears full canvas for next frame.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws world layers + character + cleanup.
     */
    drawWorldObjects() {
        this.addBackgroundAndPlatforms();
        this.addDynamicWorldObjects();
        this.cleanupDeletableObjects();
        this.addToMap(this.character);
    }

    /**
     * Renders background, platforms and clouds.
     */
    addBackgroundAndPlatforms() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.platforms);
        this.addObjectsToMap(this.level.clouds);
    }

    /**
     * Renders movable elements like coins, enemies, bottles.
     */
    addDynamicWorldObjects() {
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.floatingTexts);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Removes objects flagged for deletion.
     */
    cleanupDeletableObjects() {
        this.throwableObjects = this.throwableObjects.filter(b => !b.markForDeletion);
        this.floatingTexts = this.floatingTexts.filter(t => !t.markForDeletion);
    }

    /**
     * Draws all HUD elements and counters.
     */
    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottle);
        this.drawHudCounters();
    }

    /**
     * Schedules next render frame.
     */
    scheduleNextFrame() {
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Adds each object of list to canvas.
     * @param {Array} objects - Items to render.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Places drawable object onto canvas, flipping if needed.
     * @param {Object} mo - Mapped object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Mirrors sprite horizontally.
     * @param {Object} mo - Object being flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores normal orientation after flip.
     * @param {Object} mo - Object being reset.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Draws numeric HUD values (HP, coins, bottles).
     */
    drawHudCounters() {
        this.ctx.font = "12px mexican";
        this.ctx.fillStyle = "red";
        this.ctx.fillText(this.character.energy, 145, 45);
        this.ctx.fillText(this.character.coins, 145, 83);
        this.ctx.fillText(this.character.bottles, 145, 122);
    }


    /**
   * Checks if endboss is defeated and triggers win.
   */
    checkVictory() {
        if (this.victoryPlayed) return;
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.isDead()) this.startVictorySequence();
    }

    /**
     * Begins win sequence + plays victory music soon after.
     */
    startVictorySequence() {
        this.victoryPlayed = true;
        SoundManager.stopBackgroundMusic();
        setTimeout(() => this.playVictoryMusic(), 1000);
    }

    /**
     * Plays victory soundtrack + shows win text.
     */
    playVictoryMusic() {
        SoundManager.startBackgroundMusic("victory", 0.6);
        winText.showFor(4000);
        setTimeout(() => this.finishVictoryMusic(), 6000);
    }

    /**
     * Fades music + prepares final victory video.
     */
    finishVictoryMusic() {
        SoundManager.stopBackgroundMusic();
        laterText.showFor(2000);
        setTimeout(() => this.playVictoryVideo(), 2500);
    }

    /**
     * Plays final ending victory video.
     */
    playVictoryVideo() {
        victoryVideo.play(1);
    }

    /**
     * Triggers defeat logic once + shows loss later.
     */
    triggerLoss() {
        if (this.lossPlayed) return;
        this.lossPlayed = true;
        SoundManager.stopBackgroundMusic();
        setTimeout(() => this.showLossScreen(), 500);
    }

    /**
     * Displays game over UI + plays loss theme.
     */
    showLossScreen() {
        SoundManager.startBackgroundMusic("youLose", 0.6);
        const loseDiv = document.getElementById("loseText");
        loseDiv.classList.remove("d-none");
        loseDiv.style.display = "flex";
        loseDiv.classList.add("fade-in");
        this.gameOver = true;
    }
}
