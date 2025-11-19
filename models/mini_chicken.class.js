class MiniChicken extends MovableObject {
    x = 0;
    y = 390;
    height = 35;
    width = 35;

    // Optimierte Hitbox für einfachere Treffer
    offset = {
        top: 5,
        bottom: 0, 
        left: 2,
        right: 2
    };

    IMAGES_WALKIN = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    constructor(x) {
        super().loadImage(this.IMAGES_WALKIN[0]);
        this.loadImages(this.IMAGES_WALKIN);
        this.loadImages(this.IMAGES_DEAD);
        
        if (x) {
            this.x = x;
        } else {
            this.x = 200 + Math.random() * 4200;
        }
        
        this.speed = 0.35;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);
        
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKIN);
            }
            // ❌ FEHLERHAFTE ZEILE ENTFERNT! 
            // checkEnemyRespawn wird nicht mehr von hier aufgerufen.
        }, 200);
    }
} 