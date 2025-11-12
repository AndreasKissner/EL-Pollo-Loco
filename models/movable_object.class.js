class MovableObject {
   x = 40;
   y = 250;
   img;
   height= 150;
   width = 120;


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