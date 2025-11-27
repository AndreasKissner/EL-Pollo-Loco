class Character extends MovableObject {
    height = 270;
    width = 120;
    y = 220;
    speed = 5;
    groundLevel = 440;
    world;
    deadPlayed = false;
    deadIndex = 0;
    deadAnimationSpeed = 200;
    lastDeadFrameTime = 0;
    deadFinished = false;
    coins = 0;
    bottles = 0;
    maxBottleLimit = 5;
    deadKickApplied = false;


    offset = {
        top: 100,
        bottom: 20,
        left: 10,
        right: 30
    };

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.idleTimer = 0;
        this.applyGravity();
        this.animate();
        this.energy = 100;
    }

    /** Makes the character jump and plays the jump sound if sound is enabled. */
    jump() {
        super.jump();
        if (!SoundManager.isMuted) {
            SoundManager.play('jump');
        }
    }

    /** Starts all character movement and animation update intervals. */
    animate() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    /** Runs the movement logic on a 60 FPS interval. */
    startMovementInterval() {
        setInterval(() => {
            if (this.world.gameOver) return;
            this.handleKnockback();
            this.handleMovementRight();
            this.handleMovementLeft();
            this.handleJumpingInput();
            this.handlePlatformExit();
            this.updateCamera();
        }, 1000 / 60);
    }

    /** Applies knockback movement when the character is hit. */
    handleKnockback() {
        if (!this.hitBlocked) return;
        this.x += this.speedX;
        if (this.x < 0) this.x = 0;
    }

    /** Handles rightward movement when the right key is pressed. */
    handleMovementRight() {
        if (this.hitBlocked) return;
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
    }

    /** Handles leftward movement when the left key is pressed. */
    handleMovementLeft() {
        if (this.hitBlocked) return;
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /** Handles jump input and triggers a jump when conditions are met. */
    handleJumpingInput() {
        if (this.hitBlocked) return;
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.idleTimer = 0;
            this.currentPlatform = null;
        }
    }

    /** Detects when the character leaves a platform and clears the reference. */
    handlePlatformExit() {
        if (!this.currentPlatform) return;
        let p = this.currentPlatform;
        let left = this.x + this.width <= p.x + p.offset.left;
        let right = this.x >= p.x + p.width - p.offset.right;
        if (left || right) {
            this.currentPlatform = null;
        }
    }

    /** Updates the camera position to follow the character. */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /** Runs animation logic on a timed interval. */
    startAnimationInterval() {
        setInterval(() => {
            if (this.world.victoryPlayed) return this.showVictoryIdle();
            if (this.isDead()) return this.handleDeadAnimation();
            if (this.isHurt()) return this.handleHurtAnimation();
            this.handleNormalAnimation();

        }, 100);
    }

    /** Displays the idle frame during victory state. */
    showVictoryIdle() {
        this.img = this.imageCache[this.IMAGES_IDLE[0]];
    }

    /** Handles the character’s full death animation sequence. */
    handleDeadAnimation() {
        this.speed = 0;
        if (!this.deadKickApplied) {
            this.deadKickApplied = true;
            const direction = this.otherDirection ? 1 : -1;
            this.speedY = 15;
            this.x += direction * -1;
        }
        this.playDeadSoundOnce();
        this.updateDeadAnimationFrame();
    }


    /** Plays the death sound once when the character dies. */
    playDeadSoundOnce() {
        if (this.deadPlayed) return;

        this.deadPlayed = true;
        setTimeout(() => SoundManager.play('deadPepe', 1), 500);
    }

    /** Advances the death animation frame and checks if it is completed. */
    updateDeadAnimationFrame() {
        let now = Date.now();
        if (this.deadFinished) return;
        if (now - this.lastDeadFrameTime < this.deadAnimationSpeed) return;
        this.lastDeadFrameTime = now;
        this.img = this.imageCache[this.IMAGES_DEAD[this.deadIndex]];
        this.deadIndex++;
        if (this.deadIndex >= this.IMAGES_DEAD.length) {
            this.finishDeadAnimation();
        }
    }

    /** Finalizes the death animation and triggers the loss state once. */
    finishDeadAnimation() {
        this.deadFinished = true;
        this.deadIndex = this.IMAGES_DEAD.length - 1;

        if (!this.world.lossPlayed) {
            this.world.triggerLoss();
        }
    }

    /** Plays the hurt animation and resets the idle timer. */
    handleHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
        this.idleTimer = 0;
    }

    /** Determines and plays the appropriate default animation state. */
    handleNormalAnimation() {
        let isActive = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
        let isJumping = this.isAboveGround();
        if (isJumping) return this.handleJumpingAnimation();
        if (isActive) return this.handleWalkingAnimation();
        this.handleIdleAnimation();
    }

    /** Plays the jumping animation and resets the idle timer. */
    handleJumpingAnimation() {
        this.playAnimation(this.IMAGES_JUMPING);
        this.idleTimer = 0;
    }

    /** Plays the walking animation and triggers footstep sounds. */
    handleWalkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING);
        this.idleTimer = 0;
        if (!this.lastWalkSound || Date.now() - this.lastWalkSound > 300) {
            SoundManager.play("walkingPepe", 0.9);
            this.lastWalkSound = Date.now();
        }
    }

    /** Updates idle timing and plays idle or long-idle animations. */
  handleIdleAnimation() {
    if (this.world.keyboard.D) {
        this.idleTimer = 0;
        this.playAnimation(this.IMAGES_IDLE);
        return;
    }
    this.idleTimer++;
    if (this.idleTimer > 50) {
        this.playAnimation(this.IMAGES_LONG_IDLE); // Schlaf
        return;
    }
    this.playAnimation(this.IMAGES_IDLE);
}


    /** Checks if the character is above the ground or a platform. */
    isAboveGround() {
        if (this.hasPlatforms()) {
            return this.checkPlatformCollision();
        }
        return super.isAboveGround();
    }

    /** Determines whether the level contains any platforms. */
    hasPlatforms() {
        return (
            this.world &&
            this.world.level &&
            this.world.level.platforms &&
            this.world.level.platforms.length > 0
        );
    }

    /** Checks for collisions with platforms and handles landing. */
    checkPlatformCollision() {
        let platforms = this.world.level.platforms;
        let bottomNow = this.y + this.height;
        for (let i = 0; i < platforms.length; i++) {
            let p = platforms[i];
            if (this.isLandingOnPlatform(p, bottomNow)) {
                this.landOnPlatform(p);
                return false;
            }
        }
        return super.isAboveGround();
    }

    /** Checks whether the character is landing on the given platform. */
    isLandingOnPlatform(p, bottomNow) {
        let platformTop = p.y + (p.offset?.top || 0);
        let overlapsX =
            this.x + this.width > p.x + p.offset.left &&
            this.x < p.x + p.width - p.offset.right;
        let nextBottom = bottomNow - this.speedY;
        let falling = this.speedY <= 0;
        return (
            overlapsX &&
            falling &&
            bottomNow <= platformTop &&
            nextBottom >= platformTop
        );
    }

    /** Positions the character on top of the platform and stops vertical movement. */
    landOnPlatform(platform) {
        let platformTop = platform.y + (platform.offset?.top || 0);
        this.y = platformTop - this.height;
        this.speedY = 0;
        this.currentPlatform = platform;
    }

    /**
   * Checks collisions between character and all platforms.
   * @param {Array} platforms - List of platform objects to test against.
   */
    checkPlatformCollisions(platforms) {
        this.currentPlatform = null;
        platforms.forEach(p => {
            this.handlePlatformCollision(p);
        });
    }

    /**
     * Handles the collision logic with a specific platform.
     * @param {Object} p - Single platform to check against.
     */
    handlePlatformCollision(p) {
        const horizontal = this.isOnPlatformHorizontally(p);
        const vertical = this.isOnPlatformVertically(p);
        if (horizontal && vertical) {
            this.snapCharacterToPlatform(p);
        }
    }

    /**
     * Checks if character overlaps platform horizontally.
     * @param {Object} p - Platform object with x, width & offset.
     * @returns {Boolean}
     */
    isOnPlatformHorizontally(p) {
        return (
            this.x + this.width > p.x + p.offset.left &&
            this.x < p.x + p.width - p.offset.right
        );
    }

    /**
     * Checks vertical landing condition on platform.
     * @param {Object} p - Platform object with y and offset.
     * @returns {Boolean}
     */
    isOnPlatformVertically(p) {
        return (
            this.y + this.height > p.y - p.offset.top &&
            this.y + this.height < p.y + 30 &&
            this.speedY <= 0
        );
    }

    /**
     * Snaps character to platform surface & stops falling.
     * @param {Object} p - Platform touched / landed on.
     */
    snapCharacterToPlatform(p) {
        this.y = p.y - this.height + p.offset.top;
        this.speedY = 0;
        this.currentPlatform = p;
    }
}
