class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        //Clear world
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //Verschiebt nach links
        this.ctx.translate(this.camera_x, 0);
        //Position character
        document.getElementById("pos-char").innerText =
            "Pepe Position: X = " + Math.round(this.character.x) +
            " | Y = " + Math.round(this.character.y);
            
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character)
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
 

        this.ctx.translate(-this.camera_x, 0);

        //Draw wird immer ausgeführt
        requestAnimationFrame(() => {
            this.draw();
        });
        /* let self = this;
                requestAnimationFrame(function(){
                    self.draw
                }); */
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });

    }

    addToMap(mo) {
        //flip img
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.otherDirection) {
            mo.x = mo.x * -1;
            this.ctx.restore();
        }
    }
}