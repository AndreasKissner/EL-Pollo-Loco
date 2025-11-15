class StatusbarCoins extends DrawableObject{


   IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
 ]

   constructor() {
        super();
        this.loadImages(this.IMAGES);
         this.x = 10;
        this.y = 60;
        this.width = 170;
        this.height = 60;

        // 🔹 Sofort sichtbares Startbild
        this.img = new Image();
        this.img.src = this.IMAGES[0];

        // 🔹 Dann später richtigen Cache nutzen
      /*   setTimeout(() => this.setPercentage(100), 100); */
    }


}