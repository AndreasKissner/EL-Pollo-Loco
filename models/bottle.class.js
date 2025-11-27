/**
 * Represents a collectible bottle object in the game world.
 * @param {number} x - The horizontal position of the bottle.
 * @param {number} y - The vertical position of the bottle.
 */
class Bottle extends MovableObject {
    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');  // 
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 70;
    }
}
