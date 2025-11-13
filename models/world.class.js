class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    respawnStopped = false;    // 🔵 NEU: Respawn-Sperre

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.setWorld(); // Pepe bekommt seine World
        this.draw();
    }


    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

   draw() {
    //Clear world
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Verschiebt nach links
    this.ctx.translate(this.camera_x, 0);

    //Position character
    document.getElementById("pos-char").innerText =
        "Pepe Position: X = " + Math.round(this.character.x) +
        " | Y = " + Math.round(this.character.y);

    // 🔵 NEU: Respawn dauerhaft stoppen, wenn Pepe > 3200
    if (this.character.x > 3200) {
        this.respawnStopped = true;
    }

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character)
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);

    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => {
        this.draw();
    });
}

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });

    }

    addToMap(mo) {
        //flip img
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.otherDirection) {
            mo.x = mo.x * -1;
            this.ctx.restore();
        }
    }

    checkRespawn(enemy) {
        // Wenn Pepe mehr wie 3200 hat respan stopp
        if (this.character.x > 3200) {
            this.respawnStopped = true;
        }
    }



}