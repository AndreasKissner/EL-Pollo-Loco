class StatusbarBottle extends Statusbar {

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
        this.y = 85 ;
     
        // Start: 0 Flaschen
        this.setPercentage(0);
    }

    /**
     * Hier interpretieren wir "percentage" als
     * ANZAHL FLASCHEN (0–10) und mappen das auf 6 Bilder.
     */
    resolveImageIndex() {
        if (this.percentage === 0) return 0;      // 0 Flaschen → 0%
        if (this.percentage <= 2) return 1;       // 1–2 Flaschen → 20%
        if (this.percentage <= 4) return 2;       // 3–4 Flaschen → 40%
        if (this.percentage <= 6) return 3;       // 5–6 Flaschen → 60%
        if (this.percentage <= 8) return 4;       // 7–8 Flaschen → 80%
        return 5;                                 // 9–10 Flaschen → 100%
    }
}
