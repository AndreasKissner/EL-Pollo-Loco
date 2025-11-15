class StatusbarBottle extends DrawableObject{

 IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

       constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 110;
        this.width = 170;
        this.height = 60;

        // 🔹 Sofort sichtbares Startbild
        this.img = new Image();
        this.img.src = this.IMAGES[0];

        // 🔹 Dann später richtigen Cache nutzen
      /*   setTimeout(() => this.setPercentage(100), 100); */
    }


}