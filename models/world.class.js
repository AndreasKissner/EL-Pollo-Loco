class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    canThrow = true;
    respawnStopped = false;
    statusBar = new Statusbar();
    statusBarCoins = new StatusbarCoins();
    statusBarBottle = new StatusbarBottle();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    run() {
        // Interval for collision and logic checks
        setInterval(() => {
            this.checkcollision();
            this.checkThrowObjects();
            this.checkRespawn();
        }, 1000 / 60); // WICHTIG: Sollte schneller sein (z.B. 1000/60 oder 1000/30) für bessere Kollisionsprüfung
    }

    checkRespawn() {
        if(this.respawnStopped) return;
        let maxPosition = 720;
        
        this.level.enemies.forEach(enemy => {
            if (enemy.x > maxPosition) {
                maxPosition = enemy.x;
            }
        });

        this.level.enemies.forEach(enemy => {
            if (enemy.x < -200) { 
                enemy.x = maxPosition + 300 + Math.random() * 500;
                maxPosition = enemy.x;

                if(enemy.isDead()) {
                    // NEU: Setze Energie auf den initialen Wert (100) zurück, nicht nur 100
                    enemy.energy = enemy.initialEnergy; 
                    enemy.speed = 0.15 + Math.random() * 0.25;
                }
            }
        });
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.canThrow && this.character.bottles > 0) {
            this.canThrow = false;
            let direction = this.character.otherDirection ? -1 : 1;
            let offsetX = direction === 1 ? 100 : -30;
            
            let bottle = new ThrowableObject(
                this.character.x + offsetX,
                this.character.y + 95,
                direction
            );
            this.throwableObjects.push(bottle);
            this.character.bottles--;
            this.statusBarBottle.setPercentage(this.character.bottles);

            // Setze Wurfverzögerung (z.B. 500ms)
            setTimeout(() => {
                this.canThrow = true;
            }, 500); 
        }
        // Den "canThrow = true" Block außerhalb des If-Statements habe ich entfernt,
        // da er den Wurf sofort wieder erlauben würde, auch wenn D noch gedrückt ist.
    }

    checkcollision() {
        
        // 💥 BOTTLE VS ENEMY KOLLISION 💥
        this.throwableObjects.forEach(bottle => {
            // Nur prüfen, wenn Flasche fliegt (noch nicht getroffen/am Boden)
            if (!bottle.hasHitGround && !bottle.hasHitEnemy) {
                
                this.level.enemies.forEach(enemy => {
                    // Nur prüfen, wenn Gegner lebt und Kollision stattfindet
                    if (!enemy.isDead() && bottle.isColliding(enemy)) {

                        // --- KORRIGIERTE LOGIK ---
                        if (enemy instanceof Endboss) {
                            // Wenn Endboss: Schaden abziehen (20) und Hurt-Animation starten
                            enemy.hit(); 
                            console.log(`Endboss getroffen! Energie: ${enemy.energy}`);
                        } else {
                            // Wenn normaler Gegner (Huhn): Sofort töten
                            enemy.energy = 0; 
                        }

                        // Stoppe die Flasche und starte die Splash-Animation (Deine neue Methode)
                        bottle.onHitEnemy();
                        // -------------------------

                        // Optionale Log-Ausgabe
                        console.log("💥 Bottle trifft Gegner! Splash gestartet."); 
                    }
                });
            }
        });


        // === Enemies vs Character === (Dein alter Code)
        this.level.enemies.forEach((enemy) => {
            if (enemy.isDead()) return;

            if (this.character.isColliding(enemy)) {
                if (this.character.isAboveGround() && this.character.speedY < 0 && !this.character.hitBlocked) {
                    enemy.energy = 0;
                    this.character.speedY = 15;
                } else {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        });

        // ... (Coins, Bottles, Plattformen Code) ...
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.character.coins++;
                this.statusBarCoins.percentage++;
                this.statusBarCoins.setPercentage(this.statusBarCoins.percentage);
                if (this.statusBarCoins.percentage >= 5) {
                    this.statusBarCoins.percentage = 0;
                    this.statusBarCoins.setPercentage(0);
                    if (this.character.bottles < 10) {
                        this.character.bottles++;
                    }
                    this.statusBarBottle.setPercentage(this.character.bottles);
                }
            }
        });

        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                if (this.character.bottles < 10) {
                    this.character.bottles++;
                    this.level.bottles.splice(index, 1);
                    this.statusBarBottle.setPercentage(this.character.bottles);
                }
            }
        });

        this.character.currentPlatform = null;
        this.level.platforms.forEach(p => {
            let horizontal = this.character.x + this.character.width > p.x + p.offset.left &&
                this.character.x < p.x + p.width - p.offset.right;
            let vertical = this.character.y + this.character.height > p.y - p.offset.top &&
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
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.platforms);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.throwableObjects = this.throwableObjects.filter(b => !b.markForDeletion);

        this.addToMap(this.character);
        this.ctx.restore();

        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottle);
        this.drawHudCounters();

        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
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
        this.ctx.fillText(this.character.energy, 190, 59);
        this.ctx.fillText(this.character.coins, 190, 109);
        this.ctx.fillText(this.character.bottles, 190, 160);
    }
}