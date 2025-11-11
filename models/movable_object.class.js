class MovableObject {
   x = 120;
   y = 400;
   img;



   loadImage(path){
      this.img = new Image('img/2_character_pepe/2_walk/W-21.png');
      this.img.src = path;
   }

   moveRight() {
      console.log("Moving right");
   }

    moveLeft(){

    }

}