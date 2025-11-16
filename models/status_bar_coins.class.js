class StatusbarCoins extends Statusbar {

    coins = 0; // ⭐ ganz wichtig!

    constructor() {
        super();

        // Überschreibe die Bilder für Coins
        this.IMAGES = [
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
        ];

        this.loadImages(this.IMAGES);

        this.x = 10;
        this.y = 70;
        this.width = 170;
        this.height = 60;

        this.setPercentage(0);
    }

    resolveImageIndex() {
        if (this.percentage >= 5) return 5;
        return this.percentage;
    }
}
