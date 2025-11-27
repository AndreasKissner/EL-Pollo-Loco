/**
 * A static platform the player can stand or jump on.
 */
class Platform extends MovableObject {

    /**
     * Creates a platform at the given position.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    constructor(x, y) {
        super().loadImage('img/11_jumping_platforms/jumping_platf_1.png');
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 70;

        this.offset = {
            top: 20,
            bottom: 60,
            left: 20,
            right: 20
        };
    }
}
