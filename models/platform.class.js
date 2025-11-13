class Platform extends MovableObject{
    
    constructor(x, y) {
        super().loadImage('img/11_jumping_platforms/jumping_platf_1.png');
        this.y = y;
        this.x = x;
        this.width = 200;
        this.height = 70;
    }
}