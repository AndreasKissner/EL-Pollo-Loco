class Chicken extends MovableObject {
    y = 380; 
    height = 60;
    width = 60;

    offset = {
        top: -10,     
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

    
    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        if (x) {
            this.x = x;
        } else {
            this.x = 400 + Math.random() * 4500;
        }

        this.speed = 0.25 /* + Math.random() * 0.25; */
        this.animate(); 
    }

animate() {

    // Bewegung
    setInterval(() => {

        // ⬅️ WICHTIG: Erst laufen, wenn Spiel gestartet ist
        if (!this.world || !this.world.gameStarted) return;

        // Spiel vorbei? Stopp.
        if (this.world.gameOver) return;

        if (!this.isDead()) {
            this.moveLeft();
        }

    }, 1000 / 60);


    // Animation (Walking/Dead)
    setInterval(() => {

        // ⬅️ WICHTIG: Erst animieren, wenn Spiel gestartet ist
        if (!this.world || !this.world.gameStarted) return;

        if (this.world.gameOver) return;

        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }

    }, 200);

}


}