class Endboss extends MovableObject {

    width = 450;
    height = 400;
    y = 50;

    // --- Best Practice Variablen ---
    speed = 2.5;                      // Konstante Laufgeschwindigkeit
    direction = "left";               // "left" oder "right"
    minX = 100;                      // Linker Patrouillenpunkt
    maxX = 4450;                      // Rechter Patrouillenpunkt
    alertZone = 3940;                 // Wann Boss dich sieht
    isAlert = false;                  // Hat der Boss den Spieler entdeckt?
    

    // --- Animationen ---
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


    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);

        // Bilder im Cache speichern
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ALERT);

        this.x = this.maxX;   // Start rechts
        this.animate();
    }


    animate() {

        setInterval(() => {
            this.checkAlert();
            this.updateAnimation();
            this.updateMovement();

        }, 1000 / 30); // Best Practice: 30 FPS
    }


    // --- 1. Spieler erkennen ---
    checkAlert() {
        if (!this.world) return;

        let playerX = this.world.character.x;

        if (!this.isAlert && playerX >= this.alertZone) {
            this.isAlert = true;

            // 2 Sekunden ALERT-Animation
            this.alertStartTime = Date.now();
        }
    }


    // --- 2. Animationen sauber steuern ---
    updateAnimation() {

        if (this.isAlert && Date.now() - this.alertStartTime < 2000) {
            this.playAnimation(this.IMAGES_ALERT);
            return; // Während Alert NICHT laufen
        }

        // Danach normales Walking
        this.playAnimation(this.IMAGES_WALK);
    }


    // --- 3. Bewegung & Drehen (Best Practice) ---
    updateMovement() {

        if (!this.isAlert) {
            return; // Boss bleibt stehen bis Spieler nah genug ist
        }

        // WICHTIG: Gegner drehen sich nur optisch,
        // NICHT ihre echte X-Koordinate manipulieren!
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
