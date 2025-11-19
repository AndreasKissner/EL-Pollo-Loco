class Coin extends MovableObject {
    offset = {
        top: 35,
        bottom: 35,
        left: 50,
        right: 50
    }

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x, y) {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.y = y;
        this.width = 180;
        this.height = 110;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 300); 
    }

}
