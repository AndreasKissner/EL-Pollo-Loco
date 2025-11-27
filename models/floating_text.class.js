/**
 * Floating text animation that moves upward and disappears.
 */
class FloatingText extends DrawableObject {

    speedY = 3;
    lifeTime = 50;
    markForDeletion = false;
    text = "EXTRA BOTTLE!!";
    font = "30px mexican";
    color = "yellow";

    /**
     * Creates a floating text at a given position.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.startAnimation();
    }

    /**
     * Starts upward movement + lifetime countdown.
     */
    startAnimation() {
        const interval = setInterval(() => {
            this.moveUp();
            this.reduceLife();

            if (this.lifeOver()) {
                this.markForDeletion = true;
                clearInterval(interval);
            }
        }, 1000 / 60);
    }

    /**
     * Moves the text upward.
     */
    moveUp() {
        this.y -= this.speedY;
        if (this.y < 30) this.y = 30;
    }

    /**
     * Reduces lifetime.
     */
    reduceLife() {
        this.lifeTime--;
    }

    /**
     * Returns true when text should disappear.
     */
    lifeOver() {
        return this.lifeTime <= 0;
    }

    /**
     * Renders the floating text.
     */
    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
    }
}
