class ThrowableObject extends MovableObject {

    hasHitEnemy = false; 
    movementIntervalId; // Speichert die ID des Wurf-Intervals (wichtig zum Stoppen)
        offset = { top: 0, left: 0, right: 0, bottom: 0 };

    constructor(x, y, direction) {
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');

        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.direction = direction;

        this.rotation = 0;
        this.rotationSpeed = 0.25;
        this.throw();
        this.loadImages(this.IMAGES_BOTTLE_ROTATE);
        this.loadImages(this.IMAGES_BOTTLE_BREAK);
    }

    IMAGES_BOTTLE_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_BREAK = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    animate() {
        setInterval(() => {
            // Die Animation läuft weiter, auch wenn die Flasche schon getroffen/am Boden ist
            if (this.hasHitGround || this.hasHitEnemy) {
                this.playAnimation(this.IMAGES_BOTTLE_BREAK);

                // Wenn letzte Break-Frame gespielt wurde → Objekt aus Welt löschen
                if (this.currentImage >= this.IMAGES_BOTTLE_BREAK.length) {
                    this.markForDeletion = true;
                }
            } else {
                // Wenn Bottle noch fliegt → Rotation
                this.playAnimation(this.IMAGES_BOTTLE_ROTATE);
            }
        }, 100);
    }

    throw() {
        this.speedY = 16;
        this.applyGravity();
        this.animate();

        // ❗ Speichere die ID in der Klasse (movementIntervalId)
        this.movementIntervalId = setInterval(() => {
            this.x += 9 * this.direction;

            // Prüfen ob Bottle den BODEN erreicht hat
            // 🔥 WICHTIG: 370 ist 10px tiefer als 360
            if (this.y >= 370 && this.hasHitGround !== true) {

                this.hasHitGround = true;
                this.currentImage = 0;
                this.speedY = 0;
                this.acceleration = 0;
                this.isFalling = false;

                // Stoppt die horizontale Bewegung!
                clearInterval(this.movementIntervalId);
                console.log("Bottle am Boden – Bewegung gestoppt.");
            }
        }, 25);
    }

}