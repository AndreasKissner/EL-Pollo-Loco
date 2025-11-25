/**
 * Basic drawable game object.
 */
class DrawableObject {
   img;
   imageCache = {};
   currentImage = 0;
   x = 40;
   y = 250;
   height = 150;
   width = 120;

   /**
    * Loads one image.
    * @param {string} path
    */
   loadImage(path) {
      this.img = new Image('img/2_character_pepe/2_walk/W-21.png');
      this.img.src = path;
   }

   /**
    * Draws the object.
    * @param {CanvasRenderingContext2D} ctx
    */
   draw(ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
   }

   /**
    * Draws debug frame for some objects.
    * @param {CanvasRenderingContext2D} ctx
    */
   drawFrame(ctx) {
        if (this instanceof Character  || this instanceof Chicken || this instanceof MiniChicken || this instanceof ThrowableObject || this instanceof Endboss || this instanceof Bottle || this instanceof Coin || this instanceof Platform) {
            
            // BLAU = Das Bild 
          /*   ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

            // ROT = Die echte Hitbox 
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "red";
            ctx.rect(
                this.x + this.offset.left, 
                this.y + this.offset.top, 
                this.width - this.offset.right - this.offset.left, 
                this.height - this.offset.bottom - this.offset.top
            ); */
            ctx.stroke();
        }
    }

   /**
    * Loads multiple images.
    * @param {string[]} arr
    */
   loadImages(arr) {
      arr.forEach(path => {
         let img = new Image();
         img.src = path;
         this.imageCache[path] = img;
      });
   }
}
