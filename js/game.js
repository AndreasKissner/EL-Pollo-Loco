let canvas
let ctx;
let character = new Image();

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    character.src = '../img/2_character_pepe/2_walk/W-21.png';

    character.onload = function () {
        ctx.drawImage(character, 20, 20, 50, 150);
    };

    //Notlösung
    /*     setTimeout(() => {
              ctx.drawImage(character, 20, 20, 50, 150);
        }, 100); */

}