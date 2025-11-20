class Endboss extends MovableObject {

    width = 450;
    height = 400;

    // FIX: Bodenlinie des Spiels
    groundLevel = 440;

    offset = {
        top: 50,
        bottom: 110,
        left: 60,
        right: 40
    };

    speed = 2.25;
    direction = "left";
    minX = 100;
    maxX = 4450;
    alertZone = 3940;
    isAlert = false;
    lastFrameTime = 0;
    frameInterval = 100; // Normale Animationsgeschwindigkeit (Walk/Alert/Hurt)

    // 🔥 NEU: SPEZIELLE STEUERUNG FÜR DEN TODES-LOOP
    deathFrameInterval = 250; // ⬅️ HIER die Zahl ÄNDERN (250ms = 4 Bilder pro Sekunde)
    lastDeathFrameTime = 0;   // Timer für den Todes-Loop

    deathLoopCount = 0;
    maxDeathLoops = 2;

    IMAGES_WALK = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];


    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.x = this.maxX;

        // 🔥 FIX: Korrekter Y-Startpunkt für GroundLevel=440
        // 440 (Boden) - 400 (Höhe) = 40
        this.y = this.groundLevel - this.height;

        this.animate();
        this.applyGravity();
    }
animate() {
    setInterval(() => {

        // ❗ Nur blockieren, wenn Spiel vorbei UND Boss noch lebt
        if (this.world && this.world.gameOver && !this.isDead()) {
            return;
        }

        this.checkAlert();
        this.updateAnimation();
        this.updateMovement();
    }, 1000 / 30);
}



checkAlert() {
    if (!this.world || this.isDead()) return;

    let playerX = this.world.character.x;

    if (!this.isAlert && playerX >= this.alertZone) {
        this.isAlert = true;
        this.alertStartTime = Date.now();

        // 🔥 BOSSMUSIK STARTEN (nur 1x)
        if (!this.bossMusicStarted) {
            this.bossMusicStarted = true;

            // Normale Musik stoppen
            SoundManager.stopBackgroundMusic();

            // 1 Sekunde warten → dann Bossmusik
            setTimeout(() => {
                SoundManager.startBackgroundMusic('bossMusic', 0.4);
            }, 1000);
        }
    }
}


    updateAnimation() {
        const now = Date.now();

        // Normale Animations-Bremse
        if (!this.isDead() && now - this.lastFrameTime < this.frameInterval) {
            return;
        }
        this.lastFrameTime = now;

        // 1. DEAD (höchste Priorität)
        if (this.isDead()) {
            this.handleDeathAnimationLoop(); // Nutzt den langsameren Timer intern
            this.speed = 0;
            return;
        }

        // 2. HURT (zweite Priorität)
        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            return;
        }

        // 3. Boss steht still (Idle)
        if (!this.isAlert) {
            this.img = this.imageCache[this.IMAGES_WALK[0]];
            return;
        }

        const alertDuration = 2000;
        // 4. Während Alert/Attack
        if (Date.now() - this.alertStartTime < alertDuration) {
            this.playAnimation(this.IMAGES_ALERT);
            return;
        }

        // 5. Walking nach Alert
        this.playAnimation(this.IMAGES_WALK);
    }


    handleDeathAnimationLoop() {
        let images = this.IMAGES_DEAD;

        const now = Date.now();
        // 🔥 HIER ist der Timer für die Todes-Geschwindigkeit
        if (now - this.lastDeathFrameTime < this.deathFrameInterval) {
            return;
        }
        this.lastDeathFrameTime = now; // Timer zurücksetzen

        // --- Loop Zähler ---
        if (this.deathLoopCount >= this.maxDeathLoops) {
            this.img = this.imageCache[images[images.length - 1]];
            return;
        }

        if (this.currentImage >= images.length) {
            this.deathLoopCount++;
            this.currentImage = 0;

            if (this.deathLoopCount >= this.maxDeathLoops) {
                this.currentImage = images.length - 1;
                this.img = this.imageCache[images[this.currentImage]];
                return;
            }
        }

        let path = images[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
    }


    updateMovement() {
        if (!this.isAlert || this.isDead() || this.isHurt()) {
            return;
        }

        const alertDuration = 2000;
        if (Date.now() - this.alertStartTime < alertDuration) {
            return;
        }

        if (this.direction === "left") {
            this.moveLeft();
            this.otherDirection = false;

            if (this.x <= this.minX) {
                this.direction = "right";
            }

        } else {
            this.moveRight();
            this.otherDirection = true;

            if (this.x >= this.maxX) {
                this.direction = "left";
            }
        }
    }
}