/**
 * The Endboss enemy with alert, movement and death animations.
 */
class Endboss extends MovableObject {

    width = 450;
    height = 400;
    groundLevel = 440;
    offset = { top: 50, bottom: 110, left: 60, right: 40 };

    speed = 2.25;
    direction = "left";
    minX = 100;
    maxX = 4450;
    alertZone = 3940;
    isAlert = false;
    lastFrameTime = 0;
    frameInterval = 100;
    deathFrameInterval = 250;
    lastDeathFrameTime = 0;
    deathLoopCount = 0;
    maxDeathLoops = 2;

    IMAGES_WALK = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    /**
     * Loads images and initializes the boss.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.x = this.maxX;
        this.y = this.groundLevel - this.height;
        this.animate();
        this.applyGravity();
    }

    /**
     * Main update loop (movement + animations).
     */
    animate() {
        setInterval(() => {
            if (this.shouldStopEndboss()) return;
            this.checkAlert();
            this.updateAnimation();
            this.updateMovement();
        }, 1000 / 30);
    }

    /**
     * Stops the boss when the game is over.
     */
    shouldStopEndboss() {
        return this.world && this.world.gameOver && !this.isDead();
    }

    /**
     * Detects if the player entered the alert zone.
     */
    checkAlert() {
        if (this.shouldSkipAlert() || this.playerNotInAlertZone()) return;
        this.isAlert = true;
        this.alertStartTime = Date.now();
        this.startBossMusic();
    }

    /**
     * Skips alert check if world missing or boss dead.
     */
    shouldSkipAlert() {
        return !this.world || this.isDead();
    }

    /**
     * Returns true if player is not in alert range.
     */
    playerNotInAlertZone() {
        let playerX = this.world.character.x;
        return this.isAlert || playerX < this.alertZone;
    }

    /**
     * Plays boss music after alert triggers.
     */
    startBossMusic() {
        if (this.bossMusicStarted) return;
        this.bossMusicStarted = true;
        SoundManager.stopBackgroundMusic();
        setTimeout(() => {
            SoundManager.startBackgroundMusic('bossMusic', 0.4);
        }, 1000);
    }

    /**
     * Controls all boss animations (walk, alert, hurt, dead).
     */
    updateAnimation() {
        if (!this.isFrameTime()) return;
        if (this.isDead()) return this.animateDeath();
        if (this.isHurt()) return this.animateHurt();
        if (!this.isAlert) return this.showIdle();
        if (this.isInAlertPhase()) return this.playAnimation(this.IMAGES_ALERT);
        this.playAnimation(this.IMAGES_WALK);
    }

    /**
     * Checks frame timing for animation updates.
     */
    isFrameTime() {
        const now = Date.now();
        if (!this.isDead() && now - this.lastFrameTime < this.frameInterval) return false;
        this.lastFrameTime = now;
        return true;
    }

    /**
     * Plays death animation.
     */
    animateDeath() {
        this.handleDeathAnimationLoop();
        this.speed = 0;
    }

    /**
     * Plays hurt animation.
     */
    animateHurt() {
        this.playAnimation(this.IMAGES_HURT);
    }

    /**
     * Shows idle frame before alert.
     */
    showIdle() {
        this.img = this.imageCache[this.IMAGES_WALK[0]];
    }

    /**
     * Returns true if alert-phase timer is active.
     */
    isInAlertPhase() {
        return Date.now() - this.alertStartTime < 2000;
    }

    /**
     * Runs the death animation sequence.
     */
    handleDeathAnimationLoop() {
        if (!this.isDeathFrameTime()) return;
        if (this.deathLoopFinished()) return this.showFinalDeathFrame();
        if (this.shouldRestartDeathLoop()) this.restartDeathLoop();
        this.showCurrentDeathFrame();
        this.currentImage++;
    }

    /**
     * Checks timing for death animation frames.
     */
    isDeathFrameTime() {
        const now = Date.now();
        if (now - this.lastDeathFrameTime < this.deathFrameInterval) return false;
        this.lastDeathFrameTime = now;
        return true;
    }

    /**
     * Returns true if all death loops are complete.
     */
    deathLoopFinished() {
        return this.deathLoopCount >= this.maxDeathLoops;
    }

    /**
     * Shows the final dead frame.
     */
    showFinalDeathFrame() {
        let lastIndex = this.IMAGES_DEAD.length - 1;
        this.img = this.imageCache[this.IMAGES_DEAD[lastIndex]];
    }

    /**
     * Checks if death animation should restart from frame 0.
     */
    shouldRestartDeathLoop() {
        return this.currentImage >= this.IMAGES_DEAD.length;
    }

    /**
     * Restarts or finishes the death animation loop.
     */
    restartDeathLoop() {
        this.deathLoopCount++;
        this.currentImage = 0;
        if (this.deathLoopFinished()) {
            this.currentImage = this.IMAGES_DEAD.length - 1;
            this.showFinalDeathFrame();
        }
    }

    /**
     * Shows the current death frame.
     */
    showCurrentDeathFrame() {
        let path = this.IMAGES_DEAD[this.currentImage];
        this.img = this.imageCache[path];
    }

    /**
     * Updates boss movement logic.
     */
    updateMovement() {
        if (this.shouldNotMove()) return;
        if (this.isInAlertPhase()) return;
        this.moveInDirection();
        this.checkDirectionLimits();
    }

    /**
     * Stops movement if boss cannot move.
     */
    shouldNotMove() {
        return !this.isAlert || this.isDead() || this.isHurt();
    }

    /**
     * Moves left or right based on direction.
     */
    moveInDirection() {
        if (this.direction === "left") {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    /**
     * Switches direction at movement boundaries.
     */
    checkDirectionLimits() {
        if (this.direction === "left" && this.x <= this.minX) this.direction = "right";
        if (this.direction === "right" && this.x >= this.maxX) this.direction = "left";
    }
}
