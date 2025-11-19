class StatusbarCoins extends Statusbar {
    coins = 0;

    // Überschreibe die Bilder für Coins
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 45 ;
       
        this.setPercentage(0);
    }

    resolveImageIndex() {
        if (this.percentage >= 5) return 5;
        return this.percentage;
    }
}
