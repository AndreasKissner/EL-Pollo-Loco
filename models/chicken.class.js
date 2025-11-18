// *** chicken.class.js ***
class Chicken extends MovableObject {
    y = 370;
    height = 70;
    width = 70;
    offset = { top: 10, left: 0, right: 10, bottom: 10 };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 400 + Math.random() * 4200;
        this.speed = 0.20 + Math.random() * 0.25;
        this.animate();
    }

   animate() {
        // 1. Bewegung & Logik (60 FPS)
        setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
                
                // Nur lebende Hühner sollen wiederkommen, wenn sie rauslaufen
                // (Falls du die Methode in der Klasse hast)
                this.checkEnemyRespawn(); 
            }
        }, 1000 / 60);
        
        // 2. Animation / Bilder (Langsam)
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}