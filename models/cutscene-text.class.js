/**
 * Handles fade-in and fade-out text animations for cutscenes.
 * This class controls visibility and opacity of an HTML element
 * to create cinematic text transitions.
 */
class CutsceneText {

    /**
     * Creates a new CutsceneText controller.
     * @param {string} id - The ID of the HTML element to control.
     */
    constructor(id) {
        /**
         * The DOM element associated with this cutscene text.
         * @type {HTMLElement}
         */
        this.element = document.getElementById(id);
    }

    /**
     * Smoothly fades the element in by setting display to "block"
     * and gradually increasing opacity.
     */
    fadeIn() {
        this.element.style.display = "block";
        setTimeout(() => {
            this.element.style.opacity = "1";
        }, 20);
    }

    /**
     * Smoothly fades the element out by reducing opacity
     * and hiding the element once the animation is finished.
     */
    fadeOut() {
        this.element.style.opacity = "0";
        setTimeout(() => {
            this.element.style.display = "none";
        }, 1500);
    }

    /**
     * Shows the text, keeps it visible for a given duration,
     * then automatically fades it out.
     * @param {number} ms - Time in milliseconds before fading out.
     */
    showFor(ms) {
        this.fadeIn();
        setTimeout(() => this.fadeOut(), ms);
    }
}
