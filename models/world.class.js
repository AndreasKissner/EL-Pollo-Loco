class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    canThrow = true;
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

        // Flasche werfen NUR wenn:
        // - D gedrückt ist
        // - Werfen erlaubt (canThrow = true)
        // - mindestens 1 Bottle vorhanden
        if (this.keyboard.D && this.canThrow && this.character.bottles > 0) {

            // Werfen blockieren, solange Taste gehalten wird
            this.canThrow = false;


            // RICHTUNG BESTIMMEN (ausgeschrieben)

            let direction;
            if (this.character.otherDirection === true) {
                direction = -1;   // nach links
            } else {
                direction = 1;    // nach rechts
            }

            // ABWURFPUNKT (OFFSET) BESTIMMEN (ausgeschrieben)
            let offsetX;
            if (direction === 1) {
                offsetX = 100;    // nach rechts starten
            } else {
                offsetX = -30;    // nach links starten
            }
            // BOTTLE ERSTELLEN
            let bottle = new ThrowableObject(
                this.character.x + offsetX,
                this.character.y + 95,
                direction
            );

            this.throwableObjects.push(bottle);

            // Eine Bottle abziehen
            this.character.bottles--;
            this.statusBarBottle.setPercentage(this.character.bottles);
            console.log("Bottle geworfen!");
        }
        // Wenn Taste NICHT gedrückt ist → wieder werfen möglich
        if (!this.keyboard.D) {
            this.canThrow = true;
        }
    }

 checkcollision() {

    // === ENEMIES ===
    this.level.enemies.forEach((enemy, index) => {
        if (enemy.isDead()) return;

        if (this.character.isColliding(enemy)) {

            // Pepe springt von oben → killt Gegner
            if (this.character.isAboveGround() && this.character.speedY < 0 && !this.character.hitBlocked) {

                enemy.energy = 0;
                this.character.speedY = 15;
                console.log("Huhn erledigt!");

            } else {

                // Pepe nimmt Schaden
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        }
    });

    // === COINS ===
    this.level.coins.forEach((coin, index) => {
        if (this.character.isColliding(coin)) {

            this.level.coins.splice(index, 1);

            this.character.coins++;
            console.log("Coins eingesammelt:", this.character.coins);

            this.statusBarCoins.percentage++;
            this.statusBarCoins.setPercentage(this.statusBarCoins.percentage);

            // Bonus-Bottle bei 5 Coins
            if (this.statusBarCoins.percentage >= 5) {

                this.statusBarCoins.percentage = 0;
                this.statusBarCoins.setPercentage(0);

                if (this.character.bottles < 10) {
                    this.character.bottles++;
                    console.log("BONUS Bottle! Jetzt:", this.character.bottles);
                } else {
                    console.log("BONUS gestoppt: Max 10 Bottles erreicht.");
                }

                this.statusBarBottle.setPercentage(this.character.bottles);
            }
        }
    });

    // === BOTTLES AM BODEN ===
    this.level.bottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle)) {

            if (this.character.bottles < 10) {

                this.character.bottles++;
                console.log("Bottle eingesammelt:", this.character.bottles);

                this.level.bottles.splice(index, 1);

                this.statusBarBottle.setPercentage(this.character.bottles);

            } else {
                console.log("Bottle-Limit (10) erreicht – Bottle bleibt liegen.");
            }
        }
    });

    // === PLATTFORM-KOLLISION ===
    this.character.currentPlatform = null;

    this.level.platforms.forEach(p => {

        let horizontal =
            this.character.x + this.character.width > p.x + p.offset.left &&
            this.character.x < p.x + p.width - p.offset.right;

        let vertical =
            this.character.y + this.character.height > p.y - p.offset.top &&
            this.character.y + this.character.height < p.y + 30 &&
            this.character.speedY <= 0;

        if (horizontal && vertical) {

            this.character.y = p.y - this.character.height + p.offset.top;
            this.character.speedY = 0;

            this.character.currentPlatform = p;
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
        let newArray = [];

        for (let i = 0; i < this.throwableObjects.length; i++) {

            let currentBottle = this.throwableObjects[i];

            // Wenn Bottle NICHT gelöscht werden soll → behalten!
            if (currentBottle.markForDeletion !== true) {
                newArray.push(currentBottle);
            }
        }

        // altes Array ersetzen
        this.throwableObjects = newArray;
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