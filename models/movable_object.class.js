class MovableObject extends DrawableObject {

   img;
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
        // Wenn Objekt nicht mehr fallen soll → NICHT weiter ausführen
        if (this.isFalling === false) {
            return;
        }

        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }

    }, 1000 / 25);
}


   isAboveGround() {
      if (this instanceof ThrowableObject) { // Throwable object should alway fall
         return true
      } else {
         return this.y < 220;
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