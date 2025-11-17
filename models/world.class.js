class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    respawnStopped = false;    // 🔵 NEU: Respawn-Sperre
    statusBar = new Statusbar();
    statusBarCoins = new StatusbarCoins();
    statusBarBottle = new StatusbarBottle();
    throwableObjects = [];


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld(); // Pepe bekommt seine World
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    run() {
        setInterval(() => {
            this.checkcollision();
            this.checkThrowObjects();

        }, 200);
    }
    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 95);
            this.throwableObjects.push(bottle);
        }
    }

    checkcollision() {
        // === Enemies ===
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                console.log("Collision with Character, energy:", this.character.energy);
               /*  this.character.hit(); */
                this.statusBar.setPercentage(this.character.energy);
            }
        });


        // === COINS ===
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {

                // Coin entfernen
                this.level.coins.splice(index, 1);

                // Coin Counter
                this.character.coins++;
                console.log("Coins eingesammelt:", this.character.coins);

                // Coin-Bar +1
                this.statusBarCoins.percentage++;
                this.statusBarCoins.setPercentage(this.statusBarCoins.percentage);

                // --- BONUS-FLASCHE BEI 5 COINS ---
                if (this.statusBarCoins.percentage >= 5) {

                    // Coin-Bar wieder auf 0
                    this.statusBarCoins.percentage = 0;
                    this.statusBarCoins.setPercentage(0);

                    // Nur wenn Bottles < 10
                    if (this.character.bottles < 10) {
                        this.character.bottles++;
                        console.log("BONUS Bottle! Jetzt:", this.character.bottles);
                    } else {
                        console.log("BONUS gestoppt: Max 10 Bottles erreicht.");
                    }

                    // HUD aktualisieren
                    this.statusBarBottle.setPercentage(this.character.bottles);
                }
            }
        });


        // === BOTTLES VOM BODEN ===
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {

                // Wenn noch Platz → Bottle einsammeln
                if (this.character.bottles < 10) {

                    this.character.bottles++;
                    console.log("Bottle eingesammelt:", this.character.bottles);

                    // Bottle verschwindet aus der Welt
                    this.level.bottles.splice(index, 1);

                    // HUD aktualisieren
                    this.statusBarBottle.setPercentage(this.character.bottles);

                } else {
                    // Pepe hat 10 → Bottle bleibt liegen!
                    console.log("Bottle-Limit (10) erreicht – Bottle bleibt liegen.");
                }
            }
        });
    }




    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // ===== Welt mit Kamera verschieben =====
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.platforms);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.restore(); // Kamera AUS — HUD bleibt fix!

        // ===== StatusBars OHNE Kamera =====



        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottle);

        // 🟢 HUD Counter aktualisieren (Übergabe von this)
       this.drawHudCounters();

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

drawHudCounters() {
    // Schrift einstellen
    this.ctx.font = "14px mexican";
    this.ctx.fillStyle = "red";


    // === HEALTH (über der Health-Bar) ===
    this.ctx.fillText(this.character.energy, 190, 59);

    // === COINS ===
    this.ctx.fillText(this.character.coins, 190, 109);

    // === BOTTLES ===
    this.ctx.fillText(this.character.bottles, 190, 160);
}

 

}