class Coin extends MovableObject {
   offset = {
        top: 50,
        bottom: 50,
        left: 35,
        right: 35
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
    this.width = 200;
    this.height = 130;
    this.animate();
}

animate() {
    setInterval(() => {
        this.playAnimation(this.IMAGES_COIN);
    }, 300); // alle 300ms wechseln
}

}
