let canvas
let world;
let keyboard = new Keyboard();

// --- DEBUG ANZEIGE ---
setInterval(() => {
    let box = document.getElementById("debug");
    if (box) {
        box.innerHTML = `
            RIGHT: <span style="color:${keyboard.RIGHT ? 'lime' : 'red'}">${keyboard.RIGHT}</span><br>
            LEFT: <span style="color:${keyboard.LEFT ? 'lime' : 'red'}">${keyboard.LEFT}</span><br>
            UP: <span style="color:${keyboard.UP ? 'lime' : 'red'}">${keyboard.UP}</span><br>
            DOWN: <span style="color:${keyboard.DOWN ? 'lime' : 'red'}">${keyboard.DOWN}</span><br>
            SPACE: <span style="color:${keyboard.SPACE ? 'lime' : 'red'}">${keyboard.SPACE}</span><br>
            D: <span style="color:${keyboard.D ? 'lime' : 'red'}">${keyboard.D}</span><br>
        `;
    }
}, 100);

//Reload for Test
function reload() {
    location.reload();
}

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas,keyboard);

 /*    console.log("My character is", world.character);
    console.log("My chicken is", world.level.enemies); */
    //Notlösung
    /*     setTimeout(() => {
              ctx.drawImage(character, 20, 20, 50, 150);
        }, 100); */
};
window.addEventListener('keydown', (event) => {

  if (event.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 38) {
    keyboard.UP = true;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (event.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 38) {
    keyboard.UP = false;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (event.keyCode == 68) {
    keyboard.D = false;
  }
});
