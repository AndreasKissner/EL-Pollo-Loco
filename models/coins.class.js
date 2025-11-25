/**
 * Represents a coin object in the game.
 * The coin animates between two images to create a spinning effect.
 */
class Coin extends MovableObject {

    /**
     * Collision offset values for more accurate hit detection.
     */
    offset = {
        top: 35,
        bottom: 35,
        left: 50,
        right: 50
    }

    /**
     * Image paths for the coin animation.
     */
    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a new coin at the given x and y position.
     * @param {number} x - The x position of the coin.
     * @param {number} y - The y position of the coin.
     */
    constructor(x, y) {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.y = y;
        this.width = 180;
        this.height = 110;
        this.animate();
    }

    /**
     * Starts the coin's animation loop.
     */
    animate() {
        setInterval(() => {
            // Stop the animation if the game has ended
            if (this.shouldStopAnimation()) {
                return;
            }
            this.playAnimation(this.IMAGES_COIN);
        }, 300);
    }

       /**
     * Checks if the animation should stop.
     * Used when the game is over to prevent further updates.
     * @returns {boolean} True if the animation should stop.
     */
    shouldStopAnimation() {
        return this.world && this.world.gameOver;
    }

}
