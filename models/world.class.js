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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.run();
        this.draw();
    }

    setWorld() {
        this.character.world = this;
        const allObjects = this.getAllLevelObjects();
        allObjects.forEach(obj => this.prepareWorldObject(obj));
    }

    getAllLevelObjects() {
        return [
            ...this.level.enemies,
            ...this.level.coins,
            ...this.level.bottles,
            ...this.level.clouds
        ];
    }

    prepareWorldObject(obj) {
        obj.world = this;
        if (obj.animate) {
            obj.animate();
        }
    }

    run() {
        setInterval(() => this.gameLoop(), 1000 / 30);
    }

    gameLoop() {
        if (this.gameOver) {
            return;
        }
        this.checkcollision();
        this.checkThrowObjects();
        this.checkRespawn();
        this.checkVictory();
        this.checkGameOverState();
    }

    checkGameOverState() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (this.character.isDead() || (endboss && endboss.isDead())) {
            this.gameOver = true;
            SoundManager.stopBackgroundMusic();
        }
    }

    checkRespawn() {
        if (this.respawnStopped) {
            return;
        }
        let maxPosition = this.getMaxEnemyPosition();
        this.level.enemies.forEach(enemy => {
            maxPosition = this.respawnEnemyIfNeeded(enemy, maxPosition);
        });
    }

    getMaxEnemyPosition() {
        let maxPosition = 720;
        this.level.enemies.forEach(enemy => {
            if (!(enemy instanceof Endboss) && enemy.x > maxPosition) {
                maxPosition = enemy.x;
            }
        });
        return maxPosition;
    }

    respawnEnemyIfNeeded(enemy, maxPosition) {
        if (enemy instanceof Endboss || enemy.x >= -200) {
            return maxPosition;
        }
        enemy.x = maxPosition + 300 + Math.random() * 500;
        maxPosition = enemy.x;
        if (enemy.isDead()) {
            enemy.energy = 100;
            enemy.speed = 0.15 + Math.random() * 0.25;
        }
        return maxPosition;
    }

    checkThrowObjects() {
        if (this.gameOver) {
            return;
        }
        const now = Date.now();
        const cooldown = 1500;
        if (this.canThrowBottle(now, cooldown)) {
            this.throwBottle(now);
        }
    }

    canThrowBottle(now, cooldown) {
        return (
            this.keyboard.D &&
            now - this.lastThrowTime >= cooldown &&
            this.character.bottles > 0
        );
    }

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

    checkcollision() {
        this.checkBottleEnemyCollisions();
        this.checkCharacterEnemyCollisions();
        this.checkCoinCollisions();
        this.checkGroundBottleCollisions();
        this.checkPlatformCollisions();
    }

    checkBottleEnemyCollisions() {
        this.throwableObjects.forEach(bottle => {
            this.checkSingleBottleCollision(bottle);
        });
    }

    checkSingleBottleCollision(bottle) {
        if (bottle.hasHitGround || bottle.hasHitEnemy) {
            return;
        }
        this.level.enemies.forEach(enemy => {
            this.handleBottleVsEnemy(bottle, enemy);
        });
    }

    handleBottleVsEnemy(bottle, enemy) {
        if (enemy.isDead() || !bottle.isColliding(enemy)) {
            return;
        }
        if (enemy instanceof Endboss) {
            this.handleBottleHitEndboss(enemy);
        } else {
            this.handleBottleHitChicken(enemy);
        }
        this.applyBottleHitEffects(bottle);
    }

    handleBottleHitEndboss(enemy) {
        if (enemy.isHurt()) {
            return;
        }
        enemy.hit();
    }

    handleBottleHitChicken(enemy) {
        SoundManager.play("chickKill", 1);
        enemy.energy = 0;
    }

    applyBottleHitEffects(bottle) {
        SoundManager.play("bottleBreak", 1);
        bottle.hasHitEnemy = true;
        if (bottle.movementIntervalId) {
            clearInterval(bottle.movementIntervalId);
        }
        bottle.currentImage = 0;
        bottle.speedY = 0;
        bottle.acceleration = 0;
        bottle.isFalling = false;
    }

    checkCharacterEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            this.handleCharacterEnemyCollision(enemy);
        });
    }

    handleCharacterEnemyCollision(enemy) {
        if (enemy.isDead() || !this.character.isColliding(enemy)) {
            return;
        }
        if (enemy instanceof Endboss) {
            this.handleEndbossHitsCharacter();
            return;
        }
        if (this.isCharacterStompingEnemy()) {
            this.handleCharacterStompsEnemy(enemy);
        } else {
            this.handleEnemyHitsCharacter();
        }
    }

    handleEndbossHitsCharacter() {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }

    isCharacterStompingEnemy() {
        return (
            this.character.isAboveGround() &&
            this.character.speedY < 0 &&
            !this.character.hitBlocked
        );
    }

    handleCharacterStompsEnemy(enemy) {
        SoundManager.play("chickKill", 1);
        enemy.energy = 0;
        this.character.speedY = 15;
    }

    handleEnemyHitsCharacter() {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }

    checkCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(index);
            }
        });
    }

    collectCoin(index) {
        SoundManager.play("coinSelect", 0.3);
        this.level.coins.splice(index, 1);
        this.character.coins++;
        this.statusBarCoins.percentage++;
        this.statusBarCoins.setPercentage(this.statusBarCoins.percentage);
        if (this.statusBarCoins.percentage >= 5) {
            this.handleCoinBonus();
        }
    }

    handleCoinBonus() {
        this.statusBarCoins.percentage = 0;
        this.statusBarCoins.setPercentage(0);
        if (this.character.bottles < 10) {
            this.grantExtraBottle();
        }
        this.statusBarBottle.setPercentage(this.character.bottles);
    }

    grantExtraBottle() {
        SoundManager.play("extraBottle", 0.4);
        this.floatingTexts.push(
            new FloatingText(this.character.x + 250, this.character.y + 200)
        );
        this.character.bottles++;
    }

    checkGroundBottleCollisions() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.collectGroundBottle(index);
            }
        });
    }

    collectGroundBottle(index) {
        if (this.character.bottles >= 10) {
            return;
        }
        SoundManager.play("bottleCollect", 0.4);
        this.character.bottles++;
        this.level.bottles.splice(index, 1);
        this.statusBarBottle.setPercentage(this.character.bottles);
    }

    checkPlatformCollisions() {
        this.character.currentPlatform = null;
        this.level.platforms.forEach(p => {
            this.handlePlatformCollision(p);
        });
    }

    handlePlatformCollision(p) {
        const horizontal = this.isOnPlatformHorizontally(p);
        const vertical = this.isOnPlatformVertically(p);
        if (horizontal && vertical) {
            this.snapCharacterToPlatform(p);
        }
    }

    isOnPlatformHorizontally(p) {
        return (
            this.character.x + this.character.width > p.x + p.offset.left &&
            this.character.x < p.x + p.width - p.offset.right
        );
    }

    isOnPlatformVertically(p) {
        return (
            this.character.y + this.character.height > p.y - p.offset.top &&
            this.character.y + this.character.height < p.y + 30 &&
            this.character.speedY <= 0
        );
    }

    snapCharacterToPlatform(p) {
        this.character.y = p.y - this.character.height + p.offset.top;
        this.character.speedY = 0;
        this.character.currentPlatform = p;
    }

    draw() {
        this.clearCanvas();
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.restore();
        this.drawUI();
        this.scheduleNextFrame();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawWorldObjects() {
        this.addBackgroundAndPlatforms();
        this.addDynamicWorldObjects();
        this.cleanupDeletableObjects();
        this.addToMap(this.character);
    }

    addBackgroundAndPlatforms() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.platforms);
        this.addObjectsToMap(this.level.clouds);
    }

    addDynamicWorldObjects() {
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.floatingTexts);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
    }

    cleanupDeletableObjects() {
        this.throwableObjects = this.throwableObjects.filter(
            b => !b.markForDeletion
        );
        this.floatingTexts = this.floatingTexts.filter(
            t => !t.markForDeletion
        );
    }

    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottle);
        this.drawHudCounters();
    }

    scheduleNextFrame() {
        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    drawHudCounters() {
        this.ctx.font = "12px mexican";
        this.ctx.fillStyle = "red";
        this.ctx.fillText(this.character.energy, 145, 45);
        this.ctx.fillText(this.character.coins, 145, 83);
        this.ctx.fillText(this.character.bottles, 145, 122);
    }

    checkVictory() {
        if (this.victoryPlayed) {
            return;
        }
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.startVictorySequence();
        }
    }

    startVictorySequence() {
        this.victoryPlayed = true;
        SoundManager.stopBackgroundMusic();
        setTimeout(() => this.playVictoryMusic(), 1000);
    }

    playVictoryMusic() {
        SoundManager.startBackgroundMusic("victory", 0.6);
        winText.showFor(4000);
        setTimeout(() => this.finishVictoryMusic(), 6000);
    }

    finishVictoryMusic() {
        SoundManager.stopBackgroundMusic();
        laterText.showFor(2000);
        setTimeout(() => this.playVictoryVideo(), 2500);
    }

    playVictoryVideo() {
        victoryVideo.play(1);
    }

    triggerLoss() {
        if (this.lossPlayed) {
            return;
        }
        this.lossPlayed = true;
        SoundManager.stopBackgroundMusic();
        setTimeout(() => this.showLossScreen(), 500);
    }

    showLossScreen() {
        SoundManager.startBackgroundMusic("youLose", 0.6);
        const loseDiv = document.getElementById("loseText");
        loseDiv.classList.remove("d-none");
        loseDiv.style.display = "flex";
        loseDiv.classList.add("fade-in");
        this.gameOver = true;
    }

    generateMinimumDistanceX(enemy, maxPosition) {
        const MIN_DISTANCE = 200;
        let newX;
        let valid = false;
        while (!valid) {
            newX = maxPosition + 300 + Math.random() * 500;
            valid = this.isValidSpawnPosition(enemy, newX, MIN_DISTANCE);
        }
        return newX;
    }

    isValidSpawnPosition(enemy, newX, minDistance) {
        let valid = true;
        this.level.enemies.forEach(other => {
            if (this.isTooClose(enemy, other, newX, minDistance)) {
                valid = false;
            }
        });
        return valid;
    }

    isTooClose(enemy, other, newX, minDistance) {
        if (other === enemy || other instanceof Endboss) {
            return false;
        }
        return (
            newX < other.x + other.width + minDistance &&
            newX + enemy.width > other.x - minDistance
        );
    }
}
