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
   acceleration = 2.5; 


   applyGravity() {
      setInterval(() => {
         if(this.isAboveGround() || this.speedY > 0 ){
         this.y -= this.speedY;
         this.speedY -= this.acceleration;
         }
      }, 1000/25);
   }

   isAboveGround(){
      return this.y < 229;
   }

   loadImage(path) {
      this.img = new Image('img/2_character_pepe/2_walk/W-21.png');
      this.img.src = path;
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
      console.log("Moving right");
   }

   moveLeft() {
      setInterval(() => {
         this.x -= this.speed;
      }, 1000 / 60);
   }

   // Respawn nur, wenn nicht gestoppt 
   checkEnemyRespawn() {
      if (this.world && this.x < -50 && this.world.respawnStopped === false) {
         this.x = 3750;
      }
   }

}