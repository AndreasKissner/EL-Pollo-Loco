class DrawableObject {
   img;
   imageCache = {};
   currentImage = 0;
   x = 40;
   y = 250;
   height = 150;
   width = 120;

   loadImage(path) {
      this.img = new Image('img/2_character_pepe/2_walk/W-21.png');
      this.img.src = path;
   }

   draw(ctx) {
      try {
         ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      } catch (err) {
         console.error("❌ drawImage Fehler bei:", this);
         console.error("img:", this.img);
         console.error("img.src:", this.img?.src);
         console.error(err);
      }
   }

 drawFrame(ctx) {
        if (this instanceof Character  || this instanceof Chicken || this instanceof MiniChicken || this instanceof ThrowableObject || this instanceof Endboss) {
            
            // BLAU = Das Bild (Das siehst du jetzt schon)
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

            // 🔴 ROT = Die echte Hitbox (Das was zählt!)
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "red";
            ctx.rect(
                this.x + this.offset.left, 
                this.y + this.offset.top, 
                this.width - this.offset.right - this.offset.left, 
                this.height - this.offset.bottom - this.offset.top
            );
            ctx.stroke();
        }
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



}