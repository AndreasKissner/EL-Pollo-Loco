class ThrowableObject extends MovableObject {

  IMAGES_BOTTLE_ROTATE = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
  ];

  IMAGES_BOTTLE_BREAK = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
  ];



  constructor(x, y, direction) {
    super();
    this.loadImage('img/6_salsa_bottle/salsa_bottle.png');

    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;

    this.direction = direction;

    // ⭐ NEU: Rotation (ausgeschrieben)
    this.rotation = 0;
    this.rotationSpeed = 0.25;
    this.throw();
    this.loadImages(this.IMAGES_BOTTLE_ROTATE);
    this.loadImages(this.IMAGES_BOTTLE_BREAK);

  }
  animate() {
    setInterval(() => {

      // Wenn Bottle noch fliegt → Rotation
      if (!this.hasHitGround) {
        this.playAnimation(this.IMAGES_BOTTLE_ROTATE);
      }

      // Wenn Bottle kaputt gegangen ist
      if (this.hasHitGround) {
        this.playAnimation(this.IMAGES_BOTTLE_BREAK);

        // Wenn letzte Break-Frame gespielt wurde → Objekt aus Welt löschen
        if (this.currentImage >= this.IMAGES_BOTTLE_BREAK.length) {
          this.markForDeletion = true;
        }
      }

    }, 100);
  }



  throw() {
    this.speedY = 16;
    this.applyGravity();

    this.animate();

    let bottleInterval = setInterval(() => {
      this.x += 9 * this.direction;

      // Prüfen ob Bottle den Boden erreicht hat
      if (this.y >= 360 && this.hasHitGround !== true) {

        // Bottle hat den Boden erreicht
        this.hasHitGround = true;

        // Splash-Animation beginnt wieder bei Frame 0
        this.currentImage = 0;

        // ⭐ Stoppt die Bewegung nach unten
        this.speedY = 0;
        this.acceleration = 0;
        this.isFalling = false;

        // ⭐ Stoppt die horizontale Bewegung!
        clearInterval(bottleInterval);

        console.log("Bottle am Boden – Bewegung gestoppt.");
      }



    }, 25);
  }



}