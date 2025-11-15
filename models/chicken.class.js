class Chicken extends MovableObject {
    y = 370;
    height = 60;
    width = 60;

     offset = {
        top: 10,
        left: 0,  
        right: 10,
        bottom: 10
    };


    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 400 + Math.random() * 4200;
        this.speed = 2 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
            // spawn point chicken and last point for pepe for spawn chicken
            this.checkEnemyRespawn();

        }, 200);

    }
}