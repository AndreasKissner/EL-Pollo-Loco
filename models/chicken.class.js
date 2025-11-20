class Chicken extends MovableObject {
    y = 380; // Y-Position auf Bodenhöhe angepasst
    height = 60;
    width = 60;
    
    offset = {
        top: -10,      // Hitbox optimiert
        bottom: 5,
        left: 5,
        right: 5
    };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    // 🔥 NEU: constructor akzeptiert jetzt 'x'
    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        // Wenn ein x übergeben wird, nutze es. Sonst Zufall (Fallback).
        if (x) {
            this.x = x;
        } else {
            this.x = 400 + Math.random() * 4200;
        }
        
        this.speed = 0.20 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world && this.world.gameOver) {
    return;
}

            if (!this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
            // ❌ HIER WURDE DIE FEHLERHAFTE ZEILE ENTFERNT! 
            // Der Respawn läuft jetzt korrekt über die World-Klasse.
        }, 200);
    }
}