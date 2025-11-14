class Bottle extends MovableObject {
    
    constructor(x, y) {
        super();   // Eltern-Konstruktor korrekt aufrufen

        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');  // Nur EIN Bild

        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 70;
    }
}
