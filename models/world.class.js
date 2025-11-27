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
     * Initializes world + sets canvas, keyboard, objects & starts loop.
     * @param {HTMLCanvasElement} canvas
     * @param {Object} keyboard
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
     * Connects character + all objects with world reference.
     */
    setWorld() {
        this.character.world = this;
        const allObjects = this.getAllLevelObjects();
        allObjects.forEach(obj => this.prepareWorldObject(obj));
    }

    /**
     * Collects all dynamic level objects into one array.
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
     * Assigns world & starts animation if object supports it.
     * @param {Object} obj - Enemy, coin, bottle or cloud.
     */
    prepareWorldObject(obj) {
        obj.world = this;
        if (obj.animate) {
            obj.animate();
        }
    }

    /**
     * Main loop interval (30 FPS), triggers game logic.
     */
    run() {
        setInterval(() => this.gameLoop(), 1000 / 30);
    }

    /**
     * Executes collision checks, events & victory/game state.
     */
    gameLoop() {
        if (this.gameOver) {return;}
        this.checkcollision();
        this.checkThrowObjects();
        this.checkRespawn();
        this.checkVictory();
        this.checkGameOverState();
    }

    /**
     * Ends game if player or Endboss has died.
     */
    checkGameOverState() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (this.character.isDead() || (endboss && endboss.isDead())) {
            this.gameOver = true;
            SoundManager.stopBackgroundMusic();
        }
    }

       /**
     * Respawns enemies behind player when they fall too far back.
     */
    checkRespawn() {
        if (this.respawnStopped) {return;}
        let maxPosition = this.getMaxEnemyPosition();
        this.level.enemies.forEach(enemy => {
            maxPosition = this.respawnEnemyIfNeeded(enemy, maxPosition);
        });
    }

    /**
     * Returns highest enemy X-position (excluding Endboss).
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
     * Repositions enemy if off-screen & resets stats when dead.
     * @param {Object} enemy
     * @param {number} maxPosition
     */
    respawnEnemyIfNeeded(enemy, maxPosition) {
        if (enemy instanceof Endboss || enemy.x >= -200) {
            return maxPosition;
        }
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
     * Handles bottle throw cooldown and input trigger.
     */
    checkThrowObjects() {
        if (this.gameOver) { return; }
        const now = Date.now();
        const cooldown = 1500;
        if (this.canThrowBottle(now, cooldown)) {
            this.throwBottle(now);
        }
    }

    /**
     * Verifies if bottle can be thrown now (cooldown, key, stock).
     * @param {number} now - Current time in ms
     * @param {number} cooldown - Required delay between throws
     */
    canThrowBottle(now, cooldown) {
        return (
            this.keyboard.D &&
            now - this.lastThrowTime >= cooldown &&
            this.character.bottles > 0
        );
    }

       /**
     * Creates and throws a bottle in facing direction + updates UI.
     * @param {number} now - Timestamp for cooldown handling.
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
     * Runs collision checks for bottles, character, coins & platforms.
     */
    checkcollision() {
        this.throwableObjects.forEach(bottle => {
            bottle.checkEnemyCollisions(this.level.enemies);
        });
        this.character.checkEnemyCollisions(
            this.level.enemies,
            this.statusBar
        );
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
     * Clears canvas, draws world & HUD, then schedules new frame.
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
     * Clears entire visible canvas area.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws map visual elements including character + objects.
     */
    drawWorldObjects() {
        this.addBackgroundAndPlatforms();
        this.addDynamicWorldObjects();
        this.cleanupDeletableObjects();
        this.addToMap(this.character);
    }

    /**
     * Renders background + platforms + clouds in scene.
     */
    addBackgroundAndPlatforms() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.platforms);
        this.addObjectsToMap(this.level.clouds);
    }

    /**
     * Draws all interactable/moving world objects.
     */
    addDynamicWorldObjects() {
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.floatingTexts);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Removes bottles + texts that are flagged for deletion.
     */
    cleanupDeletableObjects() {
        this.throwableObjects = this.throwableObjects.filter(b => !b.markForDeletion);
        this.floatingTexts = this.floatingTexts.filter(t => !t.markForDeletion);
    }

    /**
     * Draws UI elements like health + counters overlay.
     */
    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottle);
        this.drawHudCounters();
    }

    /**
     * Continues rendering next draw frame (60FPS typical).
     */
    scheduleNextFrame() {
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Adds multiple objects to canvas sequentially.
     * @param {Array} objects - Drawable items.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Draws single drawable incl. flip if facing left.
     * @param {Object} mo - MovableObject or similar.
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Horizontally flips drawing context for mirrored rendering.
     * @param {Object} mo - Object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores orientation after object flip.
     * @param {Object} mo - Previously flipped object.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

       /**
     * Draws character stats (HP/Coins/Bottles) to HUD text area.
     */
    drawHudCounters() {
        this.ctx.font = "12px mexican";
        this.ctx.fillStyle = "red";
        this.ctx.fillText(this.character.energy, 145, 45);
        this.ctx.fillText(this.character.coins, 145, 83);
        this.ctx.fillText(this.character.bottles, 145, 122);
    }

    /**
     * Checks if Endboss is defeated → triggers victory sequence.
     */
    checkVictory() {
        if (this.victoryPlayed) {return;}
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.startVictorySequence();
        }
    }

    /**
     * Starts win animation, music + execution chain.
     */
    startVictorySequence() {
        this.victoryPlayed = true;
        SoundManager.stopBackgroundMusic();
        setTimeout(() => this.playVictoryMusic(), 1000);
    }

    /**
     * Plays victory music + shows win text temporarily.
     */
    playVictoryMusic() {
        SoundManager.startBackgroundMusic("victory", 0.6);
        winText.showFor(4000);
        setTimeout(() => this.finishVictoryMusic(), 6000);
    }

    /**
     * Ends victory track → shows next text then opens video.
     */
    finishVictoryMusic() {
        SoundManager.stopBackgroundMusic();
        laterText.showFor(2000);
        setTimeout(() => this.playVictoryVideo(), 2500);
    }

    /**
     * Plays final victory cutscene video.
     */
    playVictoryVideo() {
        victoryVideo.play(1);
    }

    /**
     * Triggers loss event once and delays showing defeat screen.
     */
    triggerLoss() {
        if (this.lossPlayed) { return; }
        this.lossPlayed = true;
        SoundManager.stopBackgroundMusic();
        setTimeout(() => this.showLossScreen(), 500);
    }

    /**
     * Displays game over screen + plays defeat music.
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
