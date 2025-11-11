let canvas
let ctx;
let character = new MovableObject();

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

   console.log("My character is", character);

    //Notlösung
    /*     setTimeout(() => {
              ctx.drawImage(character, 20, 20, 50, 150);
        }, 100); */

}