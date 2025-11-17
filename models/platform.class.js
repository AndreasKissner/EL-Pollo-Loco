class Platform extends MovableObject {
    constructor(x, y) {
        super().loadImage('img/11_jumping_platforms/jumping_platf_1.png');
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 70;

        this.offset = {
            top: 20,   // ⬅️ Plattformoberfläche 20px tiefer setzen
            bottom: 0,
            left:   70,
            right: 80 
        }
    }
}
