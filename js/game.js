let canvas
let world;

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas);
  



    console.log("My character is", world.character);
    console.log("My chicken is", world.enemies);

    //Notlösung
    /*     setTimeout(() => {
              ctx.drawImage(character, 20, 20, 50, 150);
        }, 100); */

}