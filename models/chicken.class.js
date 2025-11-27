/**
 * Represents a small chicken enemy that walks left and can die.
 */
class Chicken extends MovableObject {

    y = 380;
    height = 60;
    width = 60;

    offset = {
        top: -10,
        bottom: 5,
        left: 5,
        right: 5
    };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Creates a chicken enemy at the given x-position or at a random position.
     * @param {number} [x] - Optional start position.
     */
    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x ?? (400 + Math.random() * 4500);
        this.speed = 0.25;
    }

    /** Starts movement and animation intervals. */
    animate() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    /** Runs the movement logic on a 60 FPS interval. */
    startMovementInterval() {
        setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;
            if (this.world.gameOver) return;

            this.handleMovement();
        }, 1000 / 60);
    }

    /** Moves the chicken left as long as it is not dead. */
    handleMovement() {
        if (!this.isDead()) {
            this.moveLeft();
        }
    }

    /** Runs the animation updates on a timed interval. */
    startAnimationInterval() {
        setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;
            if (this.world.gameOver) return;

            this.updateAnimationState();
        }, 200);
    }

    /** Determines which animation should be displayed. */
    updateAnimationState() {
        if (this.isDead()) {
            this.playDeadAnimation();
        } else {
            this.playWalkAnimation();
        }
    }

    /** Plays the chicken's death animation. */
    playDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
    }

    /** Plays the chicken's walking animation. */
    playWalkAnimation() {
        this.playAnimation(this.IMAGES_WALKING);
    }
}
