/**
 * Status bar showing the collected bottles.
 */
class StatusbarBottle extends Statusbar {

    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

    /**
     * Creates the bottle status bar and loads the images.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 85;
        this.setPercentage(0);
    }

    /**
     * Returns the correct image index based on bottle count.
     */
    resolveImageIndex() {
        if (this.percentage === 0) return 0;
        if (this.percentage <= 2) return 1;
        if (this.percentage <= 4) return 2;
        if (this.percentage <= 6) return 3;
        if (this.percentage <= 8) return 4;
        return 5;
    }
}
