class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    lastThrowTime = 0;
    respawnStopped = false;
    statusBar = new Statusbar();
    statusBarCoins = new StatusbarCoins();
    statusBarBottle = new StatusbarBottle();
    throwableObjects = [];
    floatingTexts = [];
    victoryPlayed = false;
    lossPlayed = false;
    gameOver = false;
    gameStarted = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.run();
        this.draw();
    }

    setWorld() {
        this.character.world = this;
        const allObjects = [
            ...this.level.enemies,
            ...this.level.coins,
            ...this.level.bottles,
            ...this.level.clouds
        ];
        allObjects.forEach(obj => obj.world = this);
    }

    run() {
        setInterval(() => {
            // gAME OVER NOCH ALS Methode machen für alle aufrufe
            if (this.gameOver) {
                return;
            }
            this.checkcollision();
            this.checkThrowObjects();
            this.checkRespawn();
            // ✅ NEU: Sieg prüfen (Endboss tot?)
            this.checkVictory();
            // 🔥 HIER prüfen wir, ob jemand „Game Over“ auslöst:
            const endboss = this.level.enemies.find(e => e instanceof Endboss);

            if (this.character.isDead() || (endboss && endboss.isDead())) {
                this.gameOver = true;
                SoundManager.stopBackgroundMusic();
                console.log("GAME OVER: Pepe oder Endboss ist tot alles stoppen.");
            }

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
        if (this.gameOver) return;   // 🔥 Nach Game Over keine Würfe mehr
        const now = Date.now();
        const cooldown = 1500; // 1 Sekunde Cooldown

        // Flasche werfen NUR wenn:
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

        // === Character vs Enemies (Springen) ===
        this.level.enemies.forEach((enemy) => {
            if (enemy.isDead()) return;

            if (this.character.isColliding(enemy)) {
                if (enemy instanceof Endboss) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
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
                SoundManager.play("coinSelect", 0.3);
                this.level.coins.splice(index, 1);
                this.character.coins++;

                this.statusBarCoins.percentage++;
                this.statusBarCoins.setPercentage(this.statusBarCoins.percentage);

                // ⭐ Bei 5 Coins → EXTRA BOTTLE + FloatingText
                if (this.statusBarCoins.percentage >= 5) {
                    this.statusBarCoins.percentage = 0;
                    this.statusBarCoins.setPercentage(0);
                    if (this.character.bottles < 10) {
                        SoundManager.play("extraBottle", 0.4);
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
                    SoundManager.play("bottleCollect", 0.4);
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

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.platforms);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.floatingTexts);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        // Aufräum-Logik  was????
        this.throwableObjects = this.throwableObjects.filter(
            (b) => !b.markForDeletion
        );

        // 🔥 WICHTIG: Text, der seine Lebenszeit überschritten hat, entfernen
        this.floatingTexts = this.floatingTexts.filter((t) => !t.markForDeletion);

        this.addToMap(this.character);
        this.ctx.restore();

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
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.victoryPlayed = true;
            SoundManager.stopBackgroundMusic();

            // kleine Pause
            setTimeout(() => {
                SoundManager.startBackgroundMusic('victory', 0.6);
                // 1️⃣ YOU WIN → für 3 Sekunden (mit Fade)
                winText.showFor(4000);
                // 2️⃣ Victory-Musik läuft 10 Sekunden
                setTimeout(() => {
                    SoundManager.stopBackgroundMusic();
                    // 3️⃣ 2 HOURS LATER → 2 Sekunden (mit Fade)
                    laterText.showFor(2000);
                    // 4️⃣ Nach Text → Cutscene Video starten
                    setTimeout(() => {
                        victoryVideo.play(1);
                    }, 2500);
                }, 6000); // Dauer der Victory-Musik
            }, 1000);
        }
    }

    triggerLoss() {
        // ❌ Canvas NICHT ausblenden – rausgenommen
        if (this.lossPlayed) return;
        this.lossPlayed = true;
        SoundManager.stopBackgroundMusic();
        setTimeout(() => {
            SoundManager.startBackgroundMusic("youLose", 0.6);
            const loseDiv = document.getElementById("loseText");
            loseDiv.classList.remove("d-none");
            loseDiv.style.display = "flex";   // 🔥 wichtig, weil du display:none gesetzt hast
            loseDiv.classList.add("fade-in");
            this.gameOver = true;
        }, 500);
    }

    generateMinimumDistanceX(enemy, maxPosition) {
        const MIN_DISTANCE = 200;
        let newX;
        let valid = false;
        while (!valid) {
            newX = maxPosition + 300 + Math.random() * 500;
            valid = true;
            this.level.enemies.forEach(other => {
                if (other !== enemy && !(other instanceof Endboss)) {
                    let tooClose =
                        newX < other.x + other.width + MIN_DISTANCE &&
                        newX + enemy.width > other.x - MIN_DISTANCE;
                    if (tooClose) {
                        valid = false;
                    }
                }
            });
        }
        return newX;
    }




}
