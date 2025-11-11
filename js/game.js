let canvas
let ctx;
let character = new Character();
let chicken = new Chicken();

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

   console.log("My character is", character);
   console.log("My chicken is", chicken);

    //Notlösung
    /*     setTimeout(() => {
              ctx.drawImage(character, 20, 20, 50, 150);
        }, 100); */

}