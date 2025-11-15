class MovableObject {
   x = 40;
   y = 250;
   img;
   height = 150;
   width = 120;
   imageCache = {};
   currentImage = 0;
   speed = 0.15;
   otherDirection = false;
   speedY = 0;
   speedX = 0;
   acceleration = 2.5;
   energy = 100;
   lastHit = 0;
   hitBlocked = false;

   offset = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
   };


applyGravity() {
    setInterval(() => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }

        // Knockback / Bewegung seitlich
        this.x += this.speedX;
        this.speedX *= 0.92;   // smooth slowdown

        // ⭐ WICHTIG: Schutz gegen aus dem Level fallen
        if (this.x < 0) {
            this.x = 0;
            this.speedX = 0;
        }

    }, 1000 / 25);
}


   isAboveGround() {
      return this.y < 220;
   }

   loadImage(path) {
      this.img = new Image('img/2_character_pepe/2_walk/W-21.png');
      this.img.src = path;
   }

   draw(ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
   }

   drawFrame(ctx) {
      if (this instanceof Character || this instanceof Chicken || this instanceof MiniChicken || this instanceof Endboss) {
         ctx.beginPath();
         ctx.lineWidth = '5';
         ctx.strokeStyle = 'blue';
         ctx.rect(this.x, this.y, this.width, this.height);
         ctx.stroke();
      }
   }

   //Is collading(chicken)
   isColliding(mo) {
      return (
         this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
         this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
         this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
         this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
      );
   }

hit() {
    if (this.hitBlocked) return;

    this.energy -= 20;

    if (this.energy < 0) {
        this.energy = 0;
    } else {
        this.lastHit = new Date().getTime();
        this.hitOutTime();
    }
}


   isHurt() {
      let timepassed = new Date().getTime() - this.lastHit;
      timepassed = timepassed / 1000;
      return timepassed < 1;
   }

   isDead() {
      return this.energy == 0;
   }

   /**
* 
* @param {Arry} arr -['img/image1.png', 'img/image2.png' usw.]
*/
   loadImages(arr) {
      arr.forEach(path => {
         let img = new Image();
         img.src = path;
         this.imageCache[path] = img;
      });
   }

   playAnimation(images) {
      if (!images || images.length === 0) return;  // Schutz for fehler
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
   }

   moveRight() {
      this.x += this.speed;
   }

   moveLeft() {
      this.x -= this.speed;
   }

   jump() {
      this.speedY = 30;
   }

   // Respawn nur, wenn nicht gestoppt 
   checkEnemyRespawn() {
      if (this.world && this.x < -50 && this.world.respawnStopped === false) {
         this.x = 3750;
      }
   }


hitOutTime() {

    if (this.hitBlocked) return;

    this.hitBlocked = true;

    const jumpStrength = 12;
    const knockback = 5;

    // ✨ Knockback entgegengesetzt der Blickrichtung
    if (this.otherDirection) {
        // schaut nach links → Gegner kam von rechts → Knockback nach rechts
        this.speedX = knockback;
    } else {
        // schaut nach rechts → Gegner kam von links → Knockback nach links
        this.speedX = -knockback;
    }

    // kleiner Jump
    this.speedY = jumpStrength;

    setTimeout(() => {
        this.hitBlocked = false;
    }, 2000);
}



}