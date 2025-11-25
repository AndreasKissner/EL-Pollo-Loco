/**
 * Throwable bottle object with rotation, break animation and gravity.
 */
class ThrowableObject extends MovableObject {

    hasHitEnemy = false;
    movementIntervalId;
    offset = { top: 10, left: 10, right: 10, bottom: 10 };

    constructor(x, y, direction) {
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.direction = direction;
        this.rotation = 0;
        this.rotationSpeed = 0.25;

        this.loadImages(this.IMAGES_BOTTLE_ROTATE);
        this.loadImages(this.IMAGES_BOTTLE_BREAK);

        this.throw();
    }

    IMAGES_BOTTLE_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_BREAK = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Starts both animation modes (rotation and breaking).
     */
    animate() {
        setInterval(() => {
            if (this.shouldPlayBreakAnimation()) {
                this.playBreakAnimation();
            } else {
                this.playRotationAnimation();
            }
        }, 100);
    }

    /**
     * Returns true if the bottle has hit something.
     */
    shouldPlayBreakAnimation() {
        return this.hasHitGround || this.hasHitEnemy;
    }

    /**
     * Plays the break animation and marks the bottle for deletion.
     */
    playBreakAnimation() {
        this.playAnimation(this.IMAGES_BOTTLE_BREAK);
        if (this.currentImage >= this.IMAGES_BOTTLE_BREAK.length) {
            this.markForDeletion = true;
        }
    }

    /**
     * Plays the rotation animation while flying.
     */
    playRotationAnimation() {
        this.playAnimation(this.IMAGES_BOTTLE_ROTATE);
    }

    /**
     * Starts the throw: gravity, movement and sound.
     */
    throw() {
        this.speedY = 16;
        this.applyGravity();
        this.animate();
        SoundManager.play('bottleThrow', 0.7);
        this.startMovementLoop();
    }

    /**
     * Horizontal movement loop of the thrown bottle.
     */
    startMovementLoop() {
        this.movementIntervalId = setInterval(() => {
            this.x += 9 * this.direction;
            this.checkGroundCollision();
        }, 25);
    }

    /**
     * Checks if the bottle reached the ground.
     */
    checkGroundCollision() {
        const groundY = 445 - this.height;

        if (this.y >= groundY && !this.hasHitGround) {
            this.onHitGround();
        }
    }

    /**
     * Handles bottle impact on the ground.
     */
    onHitGround() {
        this.hasHitGround = true;
        SoundManager.play("bottleBreak", 1);
        this.currentImage = 0;
        this.speedY = 0;
        this.acceleration = 0;
        this.isFalling = false;
        clearInterval(this.movementIntervalId);
    }

    /**
     * Called when the bottle hits an enemy.
     */
    onHitEnemy() {
        this.hasHitEnemy = true;
        this.currentImage = 0;
        this.speedY = 0;
        this.acceleration = 0;
        this.isFalling = false;
        clearInterval(this.movementIntervalId);
    }
}
