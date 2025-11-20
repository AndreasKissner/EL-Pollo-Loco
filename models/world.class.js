class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    // ❌ canThrow wurde entfernt und durch lastThrowTime ersetzt.
    lastThrowTime = 0; // 🔥 NEU: Timer für Cooldown (Timestamp des letzten Wurfs)
    respawnStopped = false;
    statusBar = new Statusbar();
    statusBarCoins = new StatusbarCoins();
    statusBarBottle = new StatusbarBottle();
    throwableObjects = [];
    floatingTexts = [];
    victoryPlayed = false;
    lossPlayed = false;



    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;

        // 1. Level-Objekte initialisieren (MUSS ZUERST passieren!)
        this.setWorld();

        // 2. Spiel-Logik starten
        this.run();

        // 3. Zeichnen starten (MUSS ZULETZT passieren, nachdem alles gesetzt ist!)
        this.draw();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
    }

    run() {
        setInterval(() => {
            this.checkcollision();
            this.checkThrowObjects();
            this.checkRespawn();
            this.checkVictory();
        }, 1000 / 30);
    }

    checkRespawn() {
        if (this.respawnStopped) return;
        let maxPosition = 720;

        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Endboss) && enemy.x > maxPosition) {
                maxPosition = enemy.x;
            }
        });

        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Endboss) && enemy.x < -200) {
                enemy.x = maxPosition + 300 + Math.random() * 500;
                maxPosition = enemy.x;

                if (enemy.isDead()) {
                    enemy.energy = 100;
                    enemy.speed = 0.15 + Math.random() * 0.25;
                }
            }
        });
    }

    checkThrowObjects() {
        const now = Date.now();
        const cooldown = 1500; // 1 Sekunde Cooldown

        // Flasche werfen NUR wenn:
        // 1. D gedrückt ist
        // 2. Cooldown ist abgelaufen (mindestens 1000ms seit dem letzten Wurf)
        // 3. mindestens 1 Bottle vorhanden
        if (
            this.keyboard.D &&
            now - this.lastThrowTime >= cooldown &&
            this.character.bottles > 0
        ) {
            // Werfen blockieren, indem der Timer aktualisiert wird
            this.lastThrowTime = now;

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
            console.log("Bottle geworfen! Cooldown aktiv.");
        }
        // ❌ Entfernt die alte canThrow Logik (die hier unten stand)
    }

    checkcollision() {
        // 💥 BOTTLE VS ENEMY / BOSSBOSS KOLLISION 💥
        this.throwableObjects.forEach((bottle) => {
            if (!bottle.hasHitGround && !bottle.hasHitEnemy) {
                this.level.enemies.forEach((enemy) => {
                    if (!enemy.isDead() && bottle.isColliding(enemy)) {
                        if (enemy instanceof Endboss) {
                            // ENDBOSS wird nur verletzt
                            if (!enemy.isHurt()) {
                                enemy.hit();
                                console.log(
                                    `💥 Bottle trifft BOSS! Restenergie: ${enemy.energy}`
                                );
                            }
                        } else {
                            SoundManager.play("chickKill", 1);
                            enemy.energy = 0;
                            console.log("💥 Bottle trifft Huhn! Splash gestartet.");
                        }
                        SoundManager.play("bottleBreak", 1);  // 🔥 HIER EINFÜGEN

                        bottle.hasHitEnemy = true;
                        if (bottle.movementIntervalId)
                            clearInterval(bottle.movementIntervalId);
                        bottle.currentImage = 0;
                        bottle.speedY = 0;
                        bottle.acceleration = 0;
                        bottle.isFalling = false;
                    }
                });
            }
        });

        // 🔥 NEU: BOTTLE VS PLATFORMS KOLLISION
        /*       this.throwableObjects.forEach((bottle) => {
                  if (bottle.hasHitGround || bottle.hasHitEnemy) return;
      
                  this.level.platforms.forEach((platform) => {
                      let isFalling = bottle.speedY <= 0;
      
                      let touchesPlatform = bottle.isColliding(platform) && isFalling;
      
                      if (touchesPlatform) {
                          bottle.hasHitGround = true;
                          bottle.currentImage = 0;
                          bottle.speedY = 0;
                          if (bottle.movementIntervalId)
                              clearInterval(bottle.movementIntervalId);
      
                          console.log("💥 Flasche trifft Plattform und zerbricht.");
                      }
                  });
              }); */

        // === Character vs Enemies (Springen) ===
        this.level.enemies.forEach((enemy) => {
            if (enemy.isDead()) return;

            if (this.character.isColliding(enemy)) {
                if (enemy instanceof Endboss) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);

                    // 🎵 Prüfen ob Pepe durch Endboss gestorben ist
                    if (this.character.energy <= 0 && !this.lossPlayed) {
                        this.lossPlayed = true;

                        // Normale Musik stoppen
                        SoundManager.stopBackgroundMusic();

                        // 1 Sekunde Pause für Effekt
                        setTimeout(() => {
                            SoundManager.startBackgroundMusic('youLose', 0.6);
                        }, 1000);
                    }

                    return;
                }


                if (
                    this.character.isAboveGround() &&
                    this.character.speedY < 0 &&
                    !this.character.hitBlocked
                ) {
                    SoundManager.play("chickKill", 1);
                    enemy.energy = 0;
                    this.character.speedY = 15;
                } else {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        });

        // === COINS EINSAMMELN ===
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                SoundManager.play("coinSelect", 0.6);
                this.level.coins.splice(index, 1);
                this.character.coins++;

                this.statusBarCoins.percentage++;
                this.statusBarCoins.setPercentage(this.statusBarCoins.percentage);

                // ⭐ Bei 5 Coins → EXTRA BOTTLE + FloatingText
                if (this.statusBarCoins.percentage >= 5) {
                    this.statusBarCoins.percentage = 0;
                    this.statusBarCoins.setPercentage(0);

                    if (this.character.bottles < 10) {
                        SoundManager.play("extraBottle", 0.7);

                        //FloatingText NUR hier sichtbar
                        this.floatingTexts.push(
                            new FloatingText(this.character.x + 250, this.character.y + 200)
                        );

                        this.character.bottles++;
                    }

                    this.statusBarBottle.setPercentage(this.character.bottles);
                }
            }
        });

        // === FLASCHEN (BODEN) EINSAMMELN ===
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                if (this.character.bottles < 10) {
                    SoundManager.play("bottleCollect", 0.6);

                    // ❌ FloatingText wurde ENTFERNT (war falsch hier!)

                    this.character.bottles++;
                    this.level.bottles.splice(index, 1);
                    this.statusBarBottle.setPercentage(this.character.bottles);
                }
            }
        });

        // === PLATFORMEN ===
        this.character.currentPlatform = null;
        this.level.platforms.forEach((p) => {
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
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);

        // Reihenfolge der Ebenen (von hinten nach vorne):
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.platforms);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);

        this.addObjectsToMap(this.floatingTexts);

        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        // Aufräum-Logik
        this.throwableObjects = this.throwableObjects.filter(
            (b) => !b.markForDeletion
        );

        // 🔥 WICHTIG: Text, der seine Lebenszeit überschritten hat, entfernen
        this.floatingTexts = this.floatingTexts.filter((t) => !t.markForDeletion);

        this.addToMap(this.character);
        this.ctx.restore();

        // HUD (bleibt fix)
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottle);
        this.drawHudCounters();

        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach((o) => this.addToMap(o));
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
        this.ctx.font = "12px mexican";
        this.ctx.fillStyle = "red";
        this.ctx.fillText(this.character.energy, 145, 45);
        this.ctx.fillText(this.character.coins, 145, 83);
        this.ctx.fillText(this.character.bottles, 145, 122);
    }

    checkVictory() {
        if (this.victoryPlayed) return;

        // Endboss suchen
        const endboss = this.level.enemies.find(e => e instanceof Endboss);

        if (endboss && endboss.isDead()) {
            this.victoryPlayed = true;

            // Bossmusik aus
            SoundManager.stopBackgroundMusic();

            // 1 Sekunde Pause für Effekt
            setTimeout(() => {

                // 🔥 Victory-Sound 10 Sekunden lang
                SoundManager.startBackgroundMusic('victory', 0.6);

                // Nach 10 Sekunden → Musik stoppen oder weiterspielen lassen
                setTimeout(() => {
                    SoundManager.stopBackgroundMusic();
                    console.log("Victory-Musik beendet.");
                }, 10000);

            }, 1000);

            console.log("🎉 PEPE GEWINNT!");
        }
    }

}
