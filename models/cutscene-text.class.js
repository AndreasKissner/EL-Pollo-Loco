class CutsceneText {
    constructor(id) {
        this.element = document.getElementById(id);
    }

    fadeIn() {
        this.element.style.display = "block";
        setTimeout(() => {
            this.element.style.opacity = "1";
        }, 20);
    }

    fadeOut() {
        this.element.style.opacity = "0";
        setTimeout(() => {
            this.element.style.display = "none";
        }, 1500);
    }

    showFor(ms) {
        this.fadeIn();
        setTimeout(() => this.fadeOut(), ms);
    }
}
