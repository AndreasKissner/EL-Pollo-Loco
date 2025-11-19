class FloatingText extends DrawableObject {
    speedY = 3;
    lifeTime = 50; // Anzahl der Frames, die der Text sichtbar ist
    markForDeletion = false;
    text = "EXTRA BOTTLE!!";
    font = "30px mexican";
    color = "yellow";

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.startAnimation();
    }

    startAnimation() {
        // Bewegung und Lebensdauer
        const interval = setInterval(() => {
            this.y -= this.speedY; // Text bewegt sich nach oben
            this.lifeTime--;

            if (this.lifeTime <= 0) {
                this.markForDeletion = true; // Markiert zum Entfernen
                clearInterval(interval);
            }
        }, 1000 / 60); 
    }

    draw(ctx) {
        if (this.y < 30) {
            this.y = 30;
        }
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
    }
}