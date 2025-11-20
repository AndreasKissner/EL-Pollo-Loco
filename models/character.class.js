class Character extends MovableObject {
    height = 270;
    width = 120;
    y = 50;             // Startet etwas höher (fällt sanft herunter)
    speed = 5;

    // 🔥 FIX: Wir setzen den Boden auf die finale Bodenlinie des Bosses (440).
    groundLevel = 440;

    world;
    deadPlayed = false;
    deadIndex = 0;
    deadAnimationSpeed = 200;
    lastDeadFrameTime = 0;
    deadFinished = false;
    coins = 0;
    bottles = 0;
    maxBottleLimit = 5;

    // 🔥 HITBOX OPTIMIERUNG 🔥
    offset = {
        top: 100,
        bottom: 0,
        left: 10,
        right: 30
    };

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_JUMPING = [
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

    jump() {
        super.jump();
        SoundManager.play('jump', 1);
    }


    animate() {
        setInterval(() => {
            // Knockback (wenn verletzt)
          if (this.world && this.world.gameOver) {
        return;
    }

    // Knockback (wenn verletzt)
    if (this.hitBlocked) {
        this.x += this.speedX;
        if(this.x < 0) { this.x = 0; }
    }
            // Bewegung nur wenn nicht verletzt
            if (!this.hitBlocked && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }

            if (!this.hitBlocked && this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            if (!this.hitBlocked && this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.idleTimer = 0;
                this.currentPlatform = null;
            }

            // Plattform-Check
            if (this.currentPlatform) {
                let p = this.currentPlatform;
                let isLeftOfPlatform = this.x + this.width <= p.x + p.offset.left;
                let isRightOfPlatform = this.x >= p.x + p.width - p.offset.right;
                if (isLeftOfPlatform || isRightOfPlatform) {
                    this.currentPlatform = null;
                }
            }

            this.world.camera_x = - this.x + 100;
        }, 1000 / 60);

        // Animationen
        setInterval(() => {
            if (this.world && this.world.gameOver) {
    return;
}

            if (this.isDead()) {
                this.speed = 0;
                if (!this.deadPlayed) {
                    this.deadPlayed = true;
                    setTimeout(() => {
                        SoundManager.play('deadPepe', 1);
                    }, 500); // 0,5 Sekunden
                }

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
                return;
            }

            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);

                this.idleTimer = 0;
                return;
            }

            // --- STATUS ERMITTELN ---
            // 🔥 KORREKTUR: Jetzt zählt auch die D-Taste (Werfen) als Aktivität!
            let isActive = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
            let isJumping = this.isAboveGround();

            // --- JUMPING
            if (isJumping) {
                // Beispiel, in Character.jump()
                this.playAnimation(this.IMAGES_JUMPING);
                this.idleTimer = 0;
                return;
            }

            // --- WALKING / THROWING (Aktiv)
            if (isActive) {
                this.playAnimation(this.IMAGES_WALKING); // Nutzt Walk-Animation als Platzhalter für Aktivität
                this.idleTimer = 0;
                if (!this.lastWalkSound || Date.now() - this.lastWalkSound > 300) {
                    SoundManager.play("walkingPepe", 0.9);
                    this.lastWalkSound = Date.now();
                }
                return;
            }

            // --- IDLE / LONG-IDLE (Letzte Priorität) ---
            if (!isActive && !isJumping) {
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
        // Plattform Logik
        if (this.world && this.world.level && this.world.level.platforms) {
            let platforms = this.world.level.platforms;
            let bottomNow = this.y + this.height;
            for (let i = 0; i < platforms.length; i++) {
                let p = platforms[i];
                let platformTop = p.y + (p.offset?.top || 0);
                let overlapsX = this.x + this.width > p.x + p.offset.left &&
                    this.x < p.x + p.width - p.offset.right;
                let nextBottom = bottomNow - this.speedY;
                let falling = this.speedY <= 0;
                if (overlapsX && falling && bottomNow <= platformTop && nextBottom >= platformTop) {
                    this.y = platformTop - this.height;
                    this.speedY = 0;
                    this.currentPlatform = p;
                    return false;
                }
            }
        }
        return super.isAboveGround();
    }
}