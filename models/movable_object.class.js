class MovableObject {
   x = 40;
   y = 250;
   img;
   height = 150;
   width = 120;
   imageCache = {};
    currentImage = 0;
  


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


   moveRight() {
      console.log("Moving right");
   }

   moveLeft() {

   }

}