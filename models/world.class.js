class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    respawnStopped = false;    // 🔵 NEU: Respawn-Sperre
    statusBar = new Statusbar();


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld(); // Pepe bekommt seine World
        this.draw();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

checkCollisions() {
    setInterval(() => {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {

                // === DEBUG (optional) ===
                console.log("Collision with Character, energy:", this.character.energy);

                // === HIT AUSLÖSEN (ohne Richtung) ===
                this.character.hit();
                // StatusBar wird in5 Schritte runtergmacht
                this.statusBar.setPersentage(this.character.energy);
            }

        });

    }, 200);
}


draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    // === FIX: StatusBar soll immer sichtbar bleiben ===
    this.statusBar.x = -this.camera_x + 20; 
    this.statusBar.y = 20;

    document.getElementById("pos-char").innerText =
        "Pepe Position: X = " + Math.round(this.character.x) +
        " | Y = " + Math.round(this.character.y);

    if (this.character.x > 3200) {
        this.respawnStopped = true;
    }

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.platforms);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);

    this.addToMap(this.statusBar);

    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => this.draw());
}
 

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });

    }

    addToMap(mo) {
        //flip img
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}