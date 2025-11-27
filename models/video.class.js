/**
 * Handles displaying and controlling cutscene videos.
 */
class GameVideo {

    /**
     * @param {string} videoId - ID of the video element.
     */
    constructor(videoId) {
        this.container = document.getElementById("cutscene-container");
        this.videoElement = document.getElementById(videoId);
        this.onFinishCallback = null;

        this.videoElement.onended = () => {
            if (this.onFinishCallback) {
                this.onFinishCallback();
            }
            const menu = document.getElementById("videoEndMenu");
            menu.classList.remove("d-none");
            menu.style.display = "flex";
        };
    }

    /**
     * Shows the video container.
     */
    show() {
        this.container.style.pointerEvents = "all";
        this.container.style.opacity = "1";
    }

    /**
     * Hides the video container.
     */
    hide() {
        this.container.style.opacity = "0";
        setTimeout(() => {
            this.container.style.pointerEvents = "none";
        }, 1000);
    }

    /**
     * Starts the video from the beginning.
     * @param {number} volume - Video volume.
     */
play(volume = 1) {
    this.show();
    
    // Video sichtbar machen
    this.videoElement.style.display = "block";

    // 🔥 Wenn Sound muted ist → Video SOFORT stumm starten
    this.videoElement.muted = SoundManager.isMuted;
    this.videoElement.volume = SoundManager.isMuted ? 0 : volume;

    this.videoElement.currentTime = 0;
    this.videoElement.play();
}

    /**
     * Stops the video and hides the container.
     */
    stop() {
        this.videoElement.pause();
        this.hide();
    }

    /**
     * Registers a callback to run when the video ends.
     * @param {Function} callback
     */
    onFinish(callback) {
        this.onFinishCallback = callback;
    }
}
