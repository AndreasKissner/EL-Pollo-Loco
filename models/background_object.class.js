/**
 * Represents a static background object in the game world.
 * Extends MovableObject but does not move.
 * @param {string} imagePath - Path to the background image.
 * @param {number} x - Horizontal position of the background object.
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    constructor(imagePath, x,) {
        super().loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = x;
    }
}