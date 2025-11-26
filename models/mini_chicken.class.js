/**
 * Small chicken enemy with simple movement and animation.
 */
class MiniChicken extends MovableObject {

    x = 0;
    y = 390;
    height = 35;
    width = 35;

    offset = { top: -10, bottom: 0, left: -10, right: -10 };

    IMAGES_WALKIN = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a mini chicken enemy.
     * @param {number} x - Optional start position.
     */
    constructor(x) {
        super().loadImage(this.IMAGES_WALKIN[0]);
        this.loadImages(this.IMAGES_WALKIN);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x ? x : 200 + Math.random() * 4500;
        this.speed = 0.25;
    }

    /**
     * Starts movement and animation loops.
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Moves the chicken left continuously.
     */
    startMovementLoop() {
        setInterval(() => {
            if (this.world && this.world.gameOver) return;
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);
    }

    /**
     * Plays walking or dead animation.
     */
    startAnimationLoop() {
        setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;
            if (this.world && this.world.gameOver) return;
            if (this.isDead()) {
                SoundManager.play("mini_chicken", 4);
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKIN);
            }
        }, 200);
    }

}
