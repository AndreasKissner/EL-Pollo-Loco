/**
 * Status bar displaying the amount of collected coins.
 */
class StatusbarCoins extends Statusbar {

    coins = 0;

    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    /**
     * Creates the coin status bar and loads all images.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 45;
        this.setPercentage(0);
    }

    /**
     * Returns the correct image index based on coin count.
     */
    resolveImageIndex() {
        if (this.percentage >= 5) return 5;
        return this.percentage;
    }
}
