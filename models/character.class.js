class Character extends MovableObject {

    height = 200;
    width = 150;
    y = 230
    speed = 30;
    world;
    deadPlayed = false;
    deadIndex = 0;              // Welches Dead-Bild wir zeigen
    deadAnimationSpeed = 200;   // 200ms pro Frame
    lastDeadFrameTime = 0;
    deadFinished = false;
    coins = 0;
    bottles = 0;
    maxBottleLimit = 5;






    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_JUMPING = [
        /*    'img/2_character_pepe/3_jump/J-31.png',
            'img/2_character_pepe/3_jump/J-32.png',
            'img/2_character_pepe/3_jump/J-33.png', */
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];



    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        this.idleTimer = 0;

        this.applyGravity();
        this.animate();
    }

    animate() {
    setInterval(() => {

        // →→→ Nach RECHTS ←←←
        if (!this.hitBlocked && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {

            if (this.currentPlatform) {
                let p = this.currentPlatform;
                let rightEdge = p.x + p.width - this.width + p.offset.right;

                if (this.x >= rightEdge) {
                    return;
                }
            }

            this.moveRight();
            this.otherDirection = false;
        }

        // ←←← Nach LINKS →→→
        if (this.world.keyboard.LEFT && this.x > 0) { 
 
            if (this.currentPlatform) {
                let p = this.currentPlatform;
                let leftEdge = p.x - this.width + p.offset.left;



                if (this.x <= leftEdge) {
                    return;
                }
            }

            this.moveLeft();
            this.otherDirection = true;
        }

        // SPRINGEN
       if (this.world.keyboard.SPACE && !this.isAboveGround()) {
    this.jump();
    this.idleTimer = 0;

    // ⬇⬇⬇ HIER einfügen! ⬇⬇⬇
    this.currentPlatform = null;

}
// === Überprüfen, ob Pepe noch auf der Plattform steht ===
if (this.currentPlatform) {
    let p = this.currentPlatform;

let isLeftOfPlatform = this.x + this.width <= p.x + p.offset.left;
let isRightOfPlatform = this.x >= p.x + p.width - p.offset.right;


    // Wenn Pepe links oder rechts runterläuft → Plattform verlieren
    if (isLeftOfPlatform || isRightOfPlatform) {
        this.currentPlatform = null;
    }
}


        // KAMERA
        this.world.camera_x = - this.x + 100;

    }, 1000 / 60);
    

        setInterval(() => {

            // --- DEAD ANIMATION --- (höchste Priorität)
            if (this.isDead()) {
                this.speed = 0;
                const now = Date.now();

                if (!this.deadFinished) {
                    if (now - this.lastDeadFrameTime >= this.deadAnimationSpeed) {

                        this.lastDeadFrameTime = now;
                        this.img = this.imageCache[this.IMAGES_DEAD[this.deadIndex]];
                        this.deadIndex++;

                        if (this.deadIndex >= this.IMAGES_DEAD.length) {
                            this.deadFinished = true;
                            this.deadIndex = this.IMAGES_DEAD.length - 1;
                        }
                    }
                }
                return; // NIX anderes darf mehr laufen
            }


            // --- HURT --- (zweithöchste Priorität!)
            if (this.isHurt()) {

                // Hurt-Animation abspielen
                this.playAnimation(this.IMAGES_HURT);
                this.idleTimer = 0;

                return;
                // GANZ WICHTIG:
                // Return verhindert, dass Jump/Walk/Idle
                // die Hurt-Animation überschreiben
            }




            // --- STATUS ERMITTELN ---
            let isWalking = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
            let isJumping = this.isAboveGround();


            // --- JUMPING (kommt nach Hurt)
            if (isJumping) {
                this.playAnimation(this.IMAGES_JUMPING);
                this.idleTimer = 0;
                return;
            }

            // --- WALKING (nach Jump)
            if (isWalking) {
                this.playAnimation(this.IMAGES_WALKING);
                this.idleTimer = 0;
                return;
            }


            // --- IDLE / LONG-IDLE (letzte Priorität) ---
            if (!isWalking && !isJumping) {
                this.idleTimer++;
            } else {
                this.idleTimer = 0;
            }

            if (this.idleTimer > 50) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
                return;
            }

            this.playAnimation(this.IMAGES_IDLE);

        }, 100);
    }

    isAboveGround() {
        // 1. Wenn es eine Plattform unter Pepe gibt und er gerade darauf landet,
        //    dann ist er NICHT mehr "über dem Boden" → Gravity soll stoppen.

        if (this.world && this.world.level && this.world.level.platforms) {

            let platforms = this.world.level.platforms;

            // So würde Pepe sich im nächsten Gravity-Schritt bewegen:
            let nextY = this.y - this.speedY;
            let bottomNow = this.y + this.height;
            let bottomNext = nextY + this.height;

        for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];

    let platformTop = p.y + (p.offset?.top || 0);

    // horizontale Überlappung
    let overlapsX =
        this.x + this.width > p.x + p.offset.left &&
        this.x < p.x + p.width - p.offset.right;

    // Pepe's aktueller Boden
    let bottomNow = this.y + this.height;

    // Pepe würde im nächsten Gravity-Schritt in die Plattform „reinfallen“
    let nextBottom = bottomNow - this.speedY;

    // PEPE MUSS FALLEN (nicht hochspringen)
    let falling = this.speedY <= 0;

    if (overlapsX && falling && bottomNow <= platformTop && nextBottom >= platformTop) {
        
        // Landung perfekt
        this.y = platformTop - this.height;
        this.speedY = 0;
        this.currentPlatform = p;

        return false; // Nicht above ground
    }
}

        }

        // 2. Wenn keine Plattform-Landung:
        //    Normales Verhalten vom MovableObject (Boden bei y >= 220)
        return super.isAboveGround();
    }

}
