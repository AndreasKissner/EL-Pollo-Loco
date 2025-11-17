class ThrowableObject extends MovableObject {


constructor(x, y, direction) {
    super();
    this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;

    this.direction = direction; // 🔥 speichert Richtung

    this.throw();
}


  throw() {
    this.speedY = 22;
    this.applyGravity();
    setInterval(() => {
    this.x += 12 * this.direction; 
}, 25);

  }
}