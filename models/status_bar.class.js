/**
 * Base class for status bars showing a percentage value.
 */
class Statusbar extends DrawableObject {

    percentage = 100;

    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    /**
     * Creates the basic status bar and loads all images.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 10;
        this.width = 130;
        this.height = 45;
        this.setPercentage(100);
    }

    /**
     * Updates the status bar to the given percentage.
     * @param {number} percentage
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Returns the correct image index for the current percentage.
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage == 80) return 4;
        if (this.percentage == 60) return 3;
        if (this.percentage == 40) return 2;
        if (this.percentage == 20) return 1;
        return 0;
    }
}
